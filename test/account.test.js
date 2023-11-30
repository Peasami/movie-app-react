const {expect} = require('chai');
const request = require('supertest');
const start = require('../start');

describe('Account route', function(){
    it('should return jwt token', async function(){
        const res = await request(start)
          .post('/account/login')
          .send({ username: 'test', pw: 'test' });
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('jwtToken');
    })
});