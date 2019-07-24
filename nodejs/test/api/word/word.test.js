const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const config = require('../../../config/defaults');
const testingConfig = require('../../config')


chai.use(chaiHttp);

const { expect, assert } = chai;
const request = chai.request(`${testingConfig.host}:${testingConfig.port}`);

var loginToken = null;


describe('Test word endpoint', function () {

    it('Check if endpoint works without authorisation', function (done) {
        request
            .get('/v1/word')
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                expect(res).to.be.json;
                done();
            })
    });

    it('Login with testing credentails', function (done) {
        request
            .post('/v1/auth/login')
            .send({ user: testingConfig.testingUser })
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                expect(res.body).to.have.property('token');
                loginToken = `Bearer ${res.body.token}`;
                done();
            })
    });

    it('GET default from/limit parameters', function (done) {
        request
            .get('/v1/word')
            .set('authorisation', loginToken)
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
            .set('authorisation', loginToken)
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
            .set('authorisation', loginToken)
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
            .set('authorisation', loginToken)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.NOT_FOUND);
                expect(res).to.be.json;
                done();
            })
    });
});