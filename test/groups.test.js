const { expect } = require('chai');
const request = require('supertest');
const start = require('../start');
const exp = require('constants');
const { group } = require('console');


describe('Groups route', function () {

    // store values from tests for other tests
    let token = '';
    let userId = '';
    let groupId = '';

    it('should create a new user and return 200', async function () {
        const res = await request(start)
            .post('/account/register')
            .send({ username: 'test_test', pw: 'test_test' });
        expect(res.statusCode).to.equal(200);
    })

    it('should return jwt token', async function () {
        const res = await request(start)
            .post('/account/login')
            .send({ username: 'test_test', pw: 'test_test' });
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('jwtToken');
        token = res.body.jwtToken; // save token for later use in tests
    })

    it('should return username and userId', async function () {
        const res = await request(start)
            .get('/account/getUserInfo')
            .set('Authorization', 'Bearer ' + token);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('username');
        expect(res.body).to.have.property('userId');
        userId = res.body.userId; // save userId for later use in tests
    })

    it('should return 200 and all groups', async function () {
        const res = await request(start)
            .get('/groups/getGroups');
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
    })

    it('should return 200 and all groups with admin id', async function () {
        const res = await request(start)
            .get('/groups/getGroupsWithAdmin');
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('admin_id');
    })

    it('should create a new group', async function () {
        const res = await request(start)
            .post('/groups/createGroup')
            .set('Authorization', 'Bearer ' + token)
            .send({ adminId: userId, groupName: 'test_group', groupDesc: 'test_desc' });
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('community_id');
        expect(res.body).to.have.property('groupInfo');
        expect(res.body.groupInfo).to.have.property('adminId');
        expect(res.body.groupInfo).to.have.property('groupName');
        expect(res.body.groupInfo).to.have.property('groupDesc');
        groupId = res.body.community_id; // save groupId for later use in tests
    })



    it('should delete group', async function () {
        const res = await request(start)
            .delete('/groups/deleteGroup/' + userId + '/' + groupId)
            .set('Authorization', 'Bearer ' + token);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Group deleted');
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.have.property('removeUserRes');
        expect(res.body.result).to.have.property('removeNewsRes');
        expect(res.body.result).to.have.property('removeGroupRes');
        expect(res.body.result.removeUserRes).to.have.property('rowCount');
        expect(res.body.result.removeUserRes.rowCount).to.equal(1);
        expect(res.body.result.removeGroupRes.rowCount).to.equal(1);
    })

    it('should delete user', async function () {
        console.log('userId: ', userId);
        const res = await request(start)
            .delete('/account/Delete/' + userId)
            .set('Authorization', 'Bearer ' + token);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Delete successful');
    })

});