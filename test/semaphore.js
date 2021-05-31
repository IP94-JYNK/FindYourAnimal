'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;

const Semaphore = require('../lib/semaphore.js');


assert(Semaphore);
const semaphore = new Semaphore(2, 10, 1000);
assert(semaphore);


describe('semaphore', () => {
  it('semaphore should exist', () => {
    expect(semaphore).to.exist;
  });
  it('semaphore should be an object', () => {
    expect(semaphore).to.be.an('object');
  });
  it('semaphore should have size property', () => {
    expect(semaphore.size).to.exist;
    expect(semaphore.size).to.equal(10);
  });
  it('semaphore should have timeout property', () => {
    expect(semaphore.timeout).to.exist;
    expect(semaphore.timeout).to.equal(1000);
  });
  it('semaphore should have queue property', () => {
    expect(semaphore.queue).to.exist;
    expect(semaphore.queue.length).to.equal(0);
  });
  it('semaphore should have counter property', () => {
    expect(semaphore.counter).to.exist;
    expect(semaphore.counter).to.equal(2);
  });
  it('semaphore counter should be equal 1', () => {
    semaphore.enter();
    expect(semaphore.counter).to.equal(1);
  });
  it('semaphore counter should be equal 0', () => {
    semaphore.enter();
    expect(semaphore.counter).to.equal(0);
  });
  it('semaphore counter should be equal 1', () => {
    semaphore.leave();
    expect(semaphore.counter).to.equal(1);
  });
});
