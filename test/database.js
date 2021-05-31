'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const path = require('path');

const application = require('../lib/application.js');
application.logger = { log: console.log };

const Database = require('../lib/database.js');
assert(Database);

const Config = require('../lib/config.js');
assert(Config);

const PATH = process.cwd();
const configPath = path.join(PATH, 'config');
const empty = 'smth';

describe('database', () => {
  let config;
  let database;
  const user = {
    name: empty,
    password: empty,
    email: empty,
  };
  beforeEach(async () => {
    config = await new Config(configPath);
    database = new Database(config.sections.database);
  });
  afterEach(async () => {
    await database.delete('SystemUser', { name: empty });
  });
  it('insert user', () =>
    new Promise((res, rej) => {
      database
        .insert('SystemUser', user)
        .then(result => {
          expect(result).to.be.an('object');
          expect(result.rowCount).to.equal(1);
          res();
        })
        .catch(err => rej(err));
    }));
  it('select user', () =>
    new Promise((res, rej) => {
      database
        .insert('SystemUser', user)
        .then(async () => {
          const fields = ['name', 'password'];
          const cond = { name: empty };
          const [record] = await database.select('SystemUser', fields, cond);
          expect(record.name).to.equal(empty);
          expect(record.password).to.equal(empty);
          res();
        })
        .catch(err => rej(err));
    }));
  it('update user', () =>
    new Promise((res, rej) => {
      database
        .insert('SystemUser', user)
        .then(async () => {
          const delta = { password: empty + '1' };
          const cond = { name: empty };
          const result = await database.update('SystemUser', delta, cond);
          expect(result.rowCount).to.equal(1);
          res();
        })
        .catch(err => rej(err));
    }));
  it('delete user', () =>
    new Promise((res, rej) => {
      database
        .insert('SystemUser', user)
        .then(async () => {
          const cond = { name: empty };
          const result = await database.delete('SystemUser', cond);
          expect(result.rowCount).to.equal(1);
          res();
        })
        .catch(err => rej(err));
    }));
});
