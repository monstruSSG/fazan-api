const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const testingConfig = require('../../config')


chai.use(chaiHttp);

const { expect } = chai;
const request = chai.request(`${testingConfig.host}:${testingConfig.port}`);

var loginToken = null;

describe('Test auth', function () {

    it('Check if users is not logged', function (done) {
        request
            .get('/v1/isLogged')
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                expect(res).to.be.json;
                done();
            })
    });

    it('Try to login with testing credentails', function (done) {
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

    it('Check if user is logged', function (done) {
        request
            .get('/v1/isLogged')
            .set('authorisation', loginToken)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                done();
            })
    });

    it('Check if /word endpoint is reachable', function (done) {
        request
            .get('/v1/word')
            .set('authorisation', loginToken)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.OK);
                expect(res).to.be.json;
                done();
            })
    });

    it('Alter Token and check if it still works', function (done) {
        loginToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        request
            .get('/v1/word')
            .set('authorisation', loginToken)
            .end((_, res) => {
                expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                expect(res).to.be.json;
                done();
            })
    });
});