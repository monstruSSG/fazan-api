const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const config = require('../../../config/defaults');
const testingConfig = require('../../config')


chai.use(chaiHttp);

const { expect, assert } = chai;
const request = chai.request(`${testingConfig.host}:${testingConfig.port}`);


describe('Test word endpoint', function () {

    it('GET default from/limit parameters', function (done) {
        request
            .get('/v1/word')
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                assert(res.body.length, config.queryLimit);
                done();
            })
    });

    it('GET specific from/limit parameters', function (done) {
        let checkedLimit = 5
        request
            .get(`/v1/word?${checkedLimit}`)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                assert(res.body.length, checkedLimit);
                done();
            })
    });

    it('Check if word exists [Must pass]', function (done) {
        const goodWord = 'abagerie'
        request
            .get(`/v1/word/check/${goodWord}`)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                done();
            })
    });

    it('Check if word does not exist [Must fail]', function (done) {
        const badWord = 'nonExistingWord'
        request
            .get(`/v1/word/check/${badWord}`)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.NOT_FOUND);
                expect(res).to.be.json;
                done();
            })
    });
});