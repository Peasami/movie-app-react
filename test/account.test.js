const {expect} = require('chai');
const request = require('supertest');
const start = require('../start');
const exp = require('constants');

// store values from tests for other tests
let token = '';
let userId = '';

describe('Account route', function(){

    it('should return 401 "Username not found" if user not found', async function(){
        const res = await request(start)
          .post('/account/login')
          .send({ username: 'undefined', pw: 'test' });
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Username not found');
    })

    it('should create a new user and return 200', async function(){
      const res = await request(start)
        .post('/account/register')
        .send({ username: 'test_test', pw: 'test_test' });
      expect(res.statusCode).to.equal(200);
  })

    it('should return 401 "Incorrect password" if password is wrong', async function(){
        const res = await request(start)
          .post('/account/login')
          .send({ username: 'test_test', pw: 'undefined' });
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Incorrect password');
    })



    it('should return jwt token', async function(){
        const res = await request(start)
          .post('/account/login')
          .send({ username: 'test_test', pw: 'test_test' });
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('jwtToken');
        token = res.body.jwtToken; // save token for later use in tests
    })

    it('should return 400 "Username already exists" if username already exists', async function(){
        const res = await request(start)
          .post('/account/register')
          .send({ username: 'test_test', pw: 'test_test' });
        expect(res.statusCode).to.equal(403);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Register error');
    })

    it('should return username and userId', async function(){
        const res = await request(start)
          .get('/account/getUserInfo')
          .set('Authorization', 'Bearer ' + token);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('username');
        expect(res.body).to.have.property('userId');
        userId = res.body.userId; // save userId for later use in tests
    })

    it('should delete user', async function(){
        console.log('userId: ', userId);
        const res = await request(start)
          .delete('/account/Delete/' + userId)
          .set('Authorization', 'Bearer ' + token);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Delete successful');
    })
});