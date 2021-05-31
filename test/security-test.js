'use strict';

const {expect} = require('chai');

const security = require('../lib/security.js');

describe('security', () => {

  let password, wrongPassword;

  before(() => {
    password = 'correct password';
    wrongPassword = 'password';
  });

  describe('hashPassword', () => {
    it('should return result', () => {
      const hashedPassword = security.hashPassword(password);
      expect(hashedPassword).to.exist;
    });
    it('hashPassword should return promise', () => {
      const hashedPassword = security.hashPassword(password);
      expect(hashedPassword).to.be.a('promise');
    });
    it('type of promise value should be string', async () => {
      const hash = await security.hashPassword(password);
      expect(hash).to.be.a('string');
    });
    it('should return different results for every password', async () => {
      const hashedPasswords = [security.hashPassword(password), security.hashPassword(password), security.hashPassword(wrongPassword)];
      const results = await Promise.all(hashedPasswords);
      expect(results[0] === results[1]).to.be.false;
      expect(results[2] === results[1]).to.be.false;
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const hash = await security.hashPassword(password);
      const result = await security.validatePassword(password, hash);
      expect(result).to.be.true;
    });
    it('should return false for invalid password', async () => {
      const hash = await security.hashPassword(password);
      const result = await security.validatePassword(wrongPassword, hash);
      expect(result).to.be.false;
    });
  });
});
