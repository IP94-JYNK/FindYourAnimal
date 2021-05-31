const expect = require('chai').expect;

const Config = require('../lib/config.js');
const Mailer = require('../lib/mailer.js');
const path = require('path');

const PATH = process.cwd();
const configPath = path.join(PATH, 'config');

describe('mailer', function () {
  let mailer;
  beforeEach(async () => {
    const config = await new Config(configPath);
    mailer = new Mailer(config.sections.mail);
  });
  it('mailer should exist', function () {
    expect(mailer).to.exist;
  });
  it('mailer should be object', function () {
    expect(mailer).to.be.an('object');
  });
  it('mailer transport should be ok', function () {
    expect(mailer.transport).to.be.ok;
  });
});
