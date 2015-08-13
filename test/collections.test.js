process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var models = require("../models");

describe('COLLECTIONS', function () {

    before(function (done) {
        models.sequelize.sync({force: true}).then(function() {
            seqFixtures.loadFixtures( require('../test/fixtures/fixtures'), models )
                .then(function(){
                    models.sequelize.sync().then(function(){
                        done();
                    });
                });
        });
    });

    describe('[/api/collections]', function(done){
        it('should return 200 with authorization header', function (done) {
            request(app)
                .get('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 401 without authorization header', function (done) {
            request(app)
                .get('/api/collections')
                .set('Content-Type', 'application/json')
                .send()
                .expect(401)
                .end(done);
        });
        it('should return 2 collections', function (done) {
            request(app)
                .get('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(function(res){
                    var body = res.body;
                    expect(body.extras.collections).to.have.length(2);
                })
                .end(done);
        });
        it('should return 1 collection', function (done) {
            request(app)
                .get('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var body = res.body;
                    expect(body.extras.collections).to.have.length(1);
                })
                .end(done);
        });
        it('should first collection title should be Pierwsza kolekcja ', function (done) {
            request(app)
                .get('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(function(res){
                    var extras = res.body.extras;
                    expect(extras.collections[0].title).to.equal('Pierwsza kolekcja');
                })
                .end(done);
        });
        it('should return 201 when correct POST body and should return new collection with title Trzecia kolekcja and id', function (done) {
            request(app)
                .post('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({title: 'Trzecia kolekcja'})
                .expect(201)
                .expect(function(res){
                    var collection = res.body.extras;
                    expect(collection.id).to.exist;
                    expect(collection.title).to.equal('Trzecia kolekcja');
                })
                .end(done);
        });
        it('should return 400 when incorrect POST body', function (done) {
            request(app)
                .post('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({tutle: 'Trze'})
                .expect(400)
                .end(done);
        });
        it('should return 409 when user already create collection with name that exists', function (done) {
            request(app)
                .post('/api/collections')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({title: 'Druga kolekcja'})
                .expect(409)
                .end(done);
        });
    });
    describe('[/api/collections/:id]', function(done){
        it('should return 200 if id = 1', function (done) {
            request(app)
                .get('/api/collections/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return title collection Druga kolekcja when id = 2', function (done) {
            request(app)
                .get('/api/collections/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(function(res){
                    var collection = res.body.extras;
                    expect(collection.title).to.equal('Druga kolekcja');
                })
                .end(done);
        });
        it('should return 403 when try to get info about foreign collection', function (done) {
            request(app)
                .get('/api/collections/3')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 404 when id = 8', function (done) {
            request(app)
                .get('/api/collections/8')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(404)
                .end(done);
        });
        it('should return 403 when try to edit collections by no participant', function(done){
            request(app)
                .put('/api/collections/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send({title: 'Henio'})
                .expect(403)
                .end(done);
        });
        it('should return 200 when try to edit author by participant', function(done){
            request(app)
                .put('/api/collections/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({title: 'Henio2'})
                .expect(200)
                .end(done);
        });
        it('should return 403 when try delete author by not participant', function(done){
            request(app)
                .delete('/api/collections/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 200 when try delete author by participant', function(done){
            request(app)
                .delete('/api/collections/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(204)
                .end(done);
        });
        it('should return 404 when collection not exists', function(done){
            request(app)
                .delete('/api/collections/1000')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(404)
                .end(done);
        });
        it('should return 400 when incorrect body', function(done){
            request(app)
                .post('/api/collections/2/invite')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({mail: 'sjsjsjs@jssjs.com'})
                .expect(400)
                .end(done);
        });
        it('should return 409 when invite user already in collection or invited', function(done){
            request(app)
                .delete('/api/collections/2/invite')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({email: 'andrzejdaniel.szm@gmail.com'})
                .expect(409)
                .end(done);
        });
        it('should return 404 when try to invite user who not exists', function(done){
            request(app)
                .delete('/api/collections/2/invite')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({email: 'ania@jania.com'})
                .expect(404)
                .end(done);
        });
        it('should return 404 when try to invite to collection which not exists', function(done){
            request(app)
                .delete('/api/collections/2/invite')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send({email: 'ania@jania.com'})
                .expect(404)
                .end(done);
        });
        it('should return 403 when try to invite by not participant', function(done){
            request(app)
                .delete('/api/collections/2/invite')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send({email: 'usero@test.com'})
                .expect(404)
                .end(done);
        });
        //TODO: Create test for invitations

    });
});
