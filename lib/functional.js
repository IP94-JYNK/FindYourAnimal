'use strict';
const application = require('./application.js');

module.exports = () => {
  const { db } = application;

  const registerUser = async (password, name, email) => {
    const [userWithTheSameEmail] = await db.select('SystemUser', ['Email'], {
      email,
    });
    if (userWithTheSameEmail) return { field: 'email' };
    db.insert('SystemUser', { name, password, email });
  };

  const getUserByToken = async token => {
    const [session] = await db.select('Session', ['UserId'], { token });
    const { userid: id } = session;
    const [user] = await db.select('SystemUser', ['*'], { id });
    return user;
  };

  const getUserByEmail = async email => {
    const [user] = await db.select('SystemUser', ['*'], { email });
    return user;
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

  return Object.freeze({
    registerUser,
    getUserByToken,
    getUserByEmail,
    getDialogsByEmail,
    createDialog,
    createMessage,
    getMessages,
  });
};