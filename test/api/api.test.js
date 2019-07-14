const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const testingConfig = require('../config')


chai.use(chaiHttp);

const { expect } = chai;
const request = chai.request(`${testingConfig.host}:${testingConfig.port}`);

describe('Test Api', function () {
    context('Error handling', function () {
        it('Test not found middleware', function (done) {
            request
                .get('/unknown')
                .end((_, res) => {
                    expect(res).to.have.status(httpStatus.NOT_FOUND);
                    expect(res).to.be.json;
                    done()
                })
        });
    });
});