'use strict';

const { crypto, common } = require('./dependencies.js');
const application = require('./application.js');

const BYTE = 256;
const TOKEN = 'token';
const TOKEN_LENGTH = 32;
const LINK_LENGTH = 120;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;
const EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const FUTURE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const LOCATION = 'Path=/; Domain';
const COOKIE_DELETE = `${TOKEN}=deleted; Expires=${EPOCH}; ${LOCATION}=`;
const COOKIE_HOST = `Expires=${FUTURE}; ${LOCATION}`;

const sessions = new Map();
const cache = new WeakMap();

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  const bytes = crypto.randomBytes(base);
  let key = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = ((bytes[i] * base) / BYTE) | 0;
    key += ALPHA_DIGIT[index];
  }
  return key;
};

const parseCookies = cookie => {
  const values = {};
  const items = cookie.split(';');
  for (const item of items) {
    const parts = item.split('=');
    const key = parts[0].trim();
    const val = parts[1] || '';
    values[key] = val.trim();
  }
  return values;
};

module.exports = () => {
  const { db } = application;

  const save = (token, context) => {
    const data = JSON.stringify(context);
    db.update('Session', { data }, { token });
  };

  class Session {
    constructor(token, contextData = { token }) {
      const contextHandler = {
        get: (data, key) => {
          if (key === 'token') return this.token;
          return Reflect.get(data, key);
        },
        set: (data, key, value) => {
          const res = Reflect.set(data, key, value);
          save(token, this.data);
          return res;
        },
      };
      this.token = token;
      this.data = contextData;
      this.context = new Proxy(contextData, contextHandler);
    }
  }

  const start = (client, userId) => {
    const token = generateToken();
    const host = common.parseHost(client.req.headers.host);
    const ip = client.req.connection.remoteAddress;
    const cookie = `${TOKEN}=${token}; ${COOKIE_HOST}=${host}; HttpOnly`;
    const session = new Session(token);
    sessions.set(token, session);
    cache.set(client.req, session);
    const data = JSON.stringify(session.data);
    db.insert('Session', { userId, token, ip, data });
    if (client.res) client.res.setHeader('Set-Cookie', cookie);
    return session;
  };

  const restore = async client => {
    const cachedSession = cache.get(client.req);
    if (cachedSession) return cachedSession;
    const { cookie } = client.req.headers;
    if (!cookie) return null;
    const cookies = parseCookies(cookie);
    const { token } = cookies;
    if (!token) return null;
    let session = sessions.get(token);
    if (!session) {
      const [record] = await db.select('Session', ['Data'], { token });
      if (record && record.data) {
        const data = JSON.parse(record.data);
        session = new Session(token, data);
        sessions.set(token, session);
      }
    }
    if (!session) return null;
    cache.set(client.req, session);
    return session;
  };

  const remove = (client, token) => {
    const host = common.parseHost(client.req.headers.host);
    client.res.setHeader('Set-Cookie', COOKIE_DELETE + host);
    sessions.delete(token);
    db.delete('Session', { token });
  };

  const registerUser = async (password, name, email, favorites) => {
    const [userWithTheSameEmail] = await db.select('SystemUser', ['Email'], {
      email,
    });
    if (userWithTheSameEmail) return { field: 'email' };
    db.insert('SystemUser', { name, password, email, favorites });
  };

  const addPetFinder = async (email, data) => {
    const prev = await db.select('petFinder', ['userEmail'], {
      userEmail: email,
    });
    prev
      ? db.update('petFinder', { ...data }, { userEmail: email })
      : db.insert('petFinder', { ...data, userEmail: email });
  };

  const addPetOwner = async (email, data) => {
    const prev = await db.select('petOwner', ['userEmail'], {
      userEmail: email,
    });
    prev
      ? db.update('petOwner', { ...data }, { userEmail: email })
      : db.insert('petOwner', { ...data, userEmail: email });
  };

  const getPetOwner = email =>
    db.select('petOwner', ['*'], {
      userEmail: email,
    });

  const addPet = async (email, data) => {
    const prev = await db.select('pet', ['ownerEmail'], {
      userEmail: email,
    });
    prev
      ? db.update('pet', { ...data }, { ownerEmail: email })
      : db.insert('pet', { ...data, ownerEmail: email });
  };

  const getUser = email =>
    db
      .select('SystemUser', ['Id', 'Password'], { email })
      .then(([user]) => user);

  const getUserByEmail = async email => {
    const [user] = await db.select('SystemUser', ['Id', 'Email'], { email });
    return user;
  };

  const insertLink = async (UserId, Link) => {
    const [url] = await db.select('ConfirmUrl', ['Id'], { UserId });
    if (url) db.delete('ConfirmUrl', { UserId });
    db.insert('ConfirmUrl', { UserId, Link });
  };

  const checkLink = async Link => {
    const [exist] = await db.select('ConfirmUrl', ['Id', 'TimeStamp'], {
      Link,
    });
    if (exist) {
      const hour = (new Date() - new Date(exist.timestamp)) / 3600000 - 3;
      if (hour < 1) return true;
    }
    return false;
  };

  const generateLink = () => {
    const base = ALPHA_DIGIT.length * 3;
    const bytes = crypto.randomBytes(base);
    let key = '';
    for (let i = 0; i < LINK_LENGTH; i++) {
      const index = ((bytes[i] * base) / (BYTE * 3)) | 0;
      key += ALPHA_DIGIT[index];
    }
    return key;
  };

  const getUserByToken = async token => {
    const [session] = await db.select('Session', ['UserId'], { token });
    const { userid: id } = session;
    const [user] = await db.select('SystemUser', ['*'], { id });
    return user;
  };

  const getUserName = async email => {
    const [name] = await db.select('SystemUser', ['Name'], { email });
    return name;
  };

  const getDialogsByEmail = async email => {
    const dialogs1 = await db.select('Dialog', ['*'], { User1: email });
    const dialogs2 = await db.select('Dialog', ['*'], { User2: email });
    const dialogs = [...dialogs1, ...dialogs2];
    return dialogs;
  };

  const createDialog = async (user1, user2) => {
    const result = db.insert('Dialog', { user1, user2 });
    return result;
  };

  const createMessage = async (user1, dialogId, content) => {
    const result = await db.insert('Message', { user1, dialogId, content });
    return result;
  };

  const getMessages = async dialogId => {
    const messages = await db.select('Message', ['*'], { dialogId });
    return messages;
  };

  const getLastMessageByDialogId = async dialogId => {
    const messages = await getMessages(dialogId);
    return messages[messages.length - 1];
  };

  const searchPet = async description => {
    const pets = await db.select('pet', ['*'], { description });
    const res = await Promise.all(
      pets.map(async pet => {
        const [owner] = await getPetOwner(pet.owneremail);
        console.log(owner);
        const location = owner ? owner.location : '';
        return { ...pet, location };
      })
    );
    return res;
  };

  const searchOwner = async description => {
    const owners = await db.select('petOwner', ['*'], { description }, true);
    const res = await Promise.all(
      owners.map(async owner => {
        const [user] = await db.select('SystemUser', ['Name'], {
          email: owner.useremail,
        });
        console.log(user);
        const name = user ? user.name : '';
        return { ...owner, name };
      })
    );
    return res;
  };

  const deleteFavorite = async (data, email) => {
    await db.update('SystemUser', { ...data }, { userEmail: email });
  };

  return Object.freeze({
    start,
    restore,
    remove,
    save,
    registerUser,
    getUser,
    getUserByToken,
    getUserByEmail,
    insertLink,
    checkLink,
    generateLink,
    getDialogsByEmail,
    createDialog,
    createMessage,
    getUserName,
    getMessages,
    getLastMessageByDialogId,
    addPetFinder,
    addPetOwner,
    addPet,
    searchPet,
    searchOwner,
    deleteFavorite,
  });
};
