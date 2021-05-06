'use strict';

const expect = require('chai').expect;
const path = require('path');
const Logger = require('../lib/logger.js');
const PATH = process.cwd();
const workerId = 1;
const logPath = path.join(PATH, 'log');
const logger = new Logger(logPath, workerId);

describe('logger', function () {
  it('logger should exist', function () {
    expect(logger).to.exist;
  });
  it('logger.write should be function', function () {
    expect(logger.write).to.be.an('function');
  });
  it('logger.log should be function', function () {
    expect(logger.log).to.be.an('function');
  });
  it('logger.log should not return anything', function () {
    expect(logger.log()).to.be.an('undefined');
  });
  it('logger.path should be correct', function () {
    expect(logger.path).to.equal(logPath);
  });
});
