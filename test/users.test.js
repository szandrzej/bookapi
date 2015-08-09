process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var models = require("../models");
var async = require('async');

var correctRegister = {
    email: "test@test.com",
    password: "qwerty",
    username: 'tester'
};

var incorrectRegister = {
    mail: "test@test.com",
    passwod: "qwerty",
    tester: 'tester'
};


describe('USERS', function () {

    before(function (done) {
        models.sequelize.sync({force: true}).then(function() {
            seqFixtures.loadFixtures( require('../test/fixtures/fixtures'), models )
                .then(function(){
                    done();
                });
        });
    });

    describe('[/auth/register]', function(done){
        it('should return 201 when new user register', function (done) {
            request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send(correctRegister)
                .expect(201)
                .end(done);
        });
        it('should return 400 when incorrect user', function (done) {
            request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send(incorrectRegister)
                .expect(400)
                .end(done);
        });
        it('should return 400 when email is not valid', function (done) {
            request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send({ email: "test", username: 'nanana', password: "qwerety"})
                .expect(400)
                .end(done);
        });
        it('should return 409 when register existing user', function (done) {
            request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send({ email: "kasia@test.com", username: 'Nananana', password: "qwerty"})
                .expect(409)
                .end(done);
        });
    });
    describe('[/auth/activate/:user/:code]', function(done){
        it('should return 200 if code is valid', function (done) {
            request(app)
                .get('/auth/activate/1/123456789')
                .set('Content-Type', 'application/json')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 400 if code is not valid', function (done) {
            request(app)
                .get('/auth/activate/2/123456780')
                .set('Content-Type', 'application/json')
                .send()
                .expect(400)
                .end(done);
        });
        it('should return 400 if user is already activated', function (done) {
            request(app)
                .get('/auth/activate/3/123456780')
                .set('Content-Type', 'application/json')
                .send()
                .expect(400)
                .end(done);
        });
        it('should return 404 if user not found', function (done) {
            request(app)
                .get('/auth/activate/100/123456780')
                .set('Content-Type', 'application/json')
                .send()
                .expect(404)
                .end(done);
        });
    });

    describe('[/auth/login]', function(done){
        it('should return 200 if credentials are fine', function (done) {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({ email: 'usero@test.com', password: 'qwerty'})
                .expect(200)
                .end(done);
        });
        it('should return user, accessToken and refreshToken if credentials are fine', function (done) {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({ email: 'usero@test.com', password: 'qwerty'})
                .expect(function(res){
                    var extras = res.body.extras;
                    expect(extras).to.exist;
                    expect(extras.user.id).to.exist;
                    expect(extras.accessToken).to.exist;
                    expect(extras.refreshToken).to.exist;
                })
                .end(done);
        });
        it('should return 401 if credentials are not correct', function (done) {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({ email: 'usero@test.com', password: 'qwerty2'})
                .expect(401)
                .end(done);
        });
        it('should return 404 if email is not found in system', function (done) {
            request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({ email: 'usero@test.co', password: 'qwerty'})
                .expect(404)
                .end(done);
        });
    });
    describe('[/auth/resend]', function(done){
        it('should return 200 if mail send', function (done) {
            request(app)
                .post('/auth/resend')
                .set('Content-Type', 'application/json')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 400 if code is not valid', function (done) {
            request(app)
                .post('/auth/resend')
                .set('Content-Type', 'application/json')
                .send({mail: 'nana@com.pl'})
                .expect(400)
                .end(done);
        });
        it('should return 401 if user is already activated', function (done) {
            request(app)
                .get('/auth/resend')
                .set('Content-Type', 'application/json')
                .send({email: 'usero@test.com'})
                .expect(401)
                .end(done);
        });
        it('should return 404 if user not found', function (done) {
            request(app)
                .get('/auth/activate/100/123456780')
                .set('Content-Type', 'application/json')
                .send()
                .expect(404)
                .end(done);
        });
    });
});
