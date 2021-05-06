const expect = require('chai').expect;

const Config = require('../lib/config.js');
const path = require('path');

const PATH = process.cwd();
const configPath = path.join(PATH, 'config');

const server = {
  host: '127.0.0.1',
  ports: [8000, 8001, 8002, 8003],
  timeout: 5000,
  concurrency: 1000,
  queue: {
    size: 2000,
    timeout: 3000,
  },
};

const database = {
  host: '127.0.0.1',
  port: 5432,
  database: 'findyouranimal',
  user: 'usertest',
  password: 'password',
};

describe('config', function () {
  let config;
  beforeEach(async () => {
    config = await new Config(configPath);
  });
  it('config should exist', function () {
    expect(config).to.exist;
  });
  it('config should be object', function () {
    expect(config).to.be.an('object');
  });
  it('config should contains db property', function () {
    expect(config.sections.database).to.exist;
    expect(config.sections.database.database).to.exist;
    expect(config.sections.database.database).to.be.equal(database.database);
  });
  it('config should contains server property', function () {
    expect(config.sections.server).to.exist;
    expect(config.sections.server.host).to.exist;
    expect(config.sections.server.host).to.be.equal(server.host);
  });
  it('config should contains mail property', function () {
    expect(config.sections.mail).to.exist;
  });
});
