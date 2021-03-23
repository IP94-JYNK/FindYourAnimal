'use strict';

const {expect} = require('chai');

const Server = require('../lib/server.js');

function Config() {
  this.host = '127.0.0.1',
  this.ports = [ 8000, 8001, 8002, 8003 ];
  this.timeout = 5000;
  this.concurrency = 1000;
  this.queue = { size: 2000, timeout: 3000 };
}

describe('server', () => {
  let config, server;

  before(() => {
    config = new Config();
    server = new Server(config);
  });
  after(() => {
    server.close().catch((err)=> console.log(err));
  });
  it('server should exist', () => {
    expect(server).to.exist;
  });
  it('all fields should exist', () => {
    expect(server.config).to.exist;
    expect(server.semaphore).to.exist;
    expect(server.ports).to.exist;
    expect(server.instance).to.exist;
    expect(server.ws).to.exist;
  });
});
