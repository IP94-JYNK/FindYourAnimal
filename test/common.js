'use strict';

const expect = require('chai').expect;
const { parseHost, timeout, sample } = require('../lib/common.js');
const path = require('path');

const PATH = process.cwd();
const commonPath = path.join(PATH, 'common');
const sampleTestArray = [1, 2, 3]
const sampleTestWrongArray = [4,5,6]

describe('common', function () {
    it('parseHost should return result before :', function () {
        expect(parseHost('127.0.0.1:8000')).to.equal('127.0.0.1');
    });
    it('parseHost should return result even if there is no :', function () {
        expect(parseHost('8800.555.35.35')).to.equal('8800.555.35.35');
    });
    it('sample should return random value of array', function () {
        expect(sample(sampleTestArray)).to.be.an('number').and.be.oneOf(sampleTestArray);
    });
    it('timeout should return Promise', function () {
        expect(timeout(100)).to.be.an.instanceof(Promise);
    });
    it('sample should return random value of array', function () {
        expect(sample(sampleTestArray)).to.be.an('number').and.be.not.oneOf(sampleTestWrongArray);
    });
});
