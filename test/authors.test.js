process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var models = require("../models");

var correctNewAuthor = {
    firstName: "Tom",
    lastName: "Clancy",
    nationality: "US"
};

var incorrectNewAuthor = {
    firstNam: "Tom",
    lastName: "Clancy",
    nationality: "US"
};

describe('AUTHORS', function () {

    before(function (done) {
        models.sequelize.sync({force: true}).then(function() {
            seqFixtures.loadFixtures( require('../test/fixtures/fixtures'), models )
                .then(function(){
                    done();
                });
        });
    });

    describe('[/api/authors]', function(done){
        it('should return 200 with authorization header', function (done) {
            request(app)
                .get('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 401 without authorization header', function (done) {
            request(app)
                .get('/api/authors')
                .set('Content-Type', 'application/json')
                .send()
                .expect(401)
                .end(done);
        });
        it('should return 5 authors', function (done) {
            request(app)
                .get('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var body = res.body;
                    expect(body.extras.authors).to.have.length(5);
                })
                .end(done);
        });
        it('should first author be Henryk Sienkiewicz', function (done) {
            request(app)
                .get('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var extras = res.body.extras;
                    expect(extras.authors[0].firstName).to.equal('Henryk');
                    expect(extras.authors[0].lastName).to.equal('Sienkiewicz');
                })
                .end(done);
        });
        it('should return 201 when correct POST body and should return new author with id and nationality US', function (done) {
            request(app)
                .post('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send(correctNewAuthor)
                .expect(201)
                .expect(function(res){
                    var author = res.body.extras;
                    expect(author.id).to.exist;
                    expect(author.nationality).to.equal('US');
                })
                .end(done);
        });
        it('should return 400 when incorrect POST body', function (done) {
            request(app)
                .post('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send(incorrectNewAuthor)
                .expect(400)
                .end(done);
        });
        it('should return 409 when send author that exists', function (done) {
            request(app)
                .post('/api/authors')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send({firstName: 'Henryk', lastName: 'Sienkiewicz'})
                .expect(409)
                .end(done);
        });
    });
    describe('[/api/authors/:id]', function(done){
        it('should return 200 if id = 1', function (done) {
            request(app)
                .get('/api/authors/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return author J.R.R Tolkien if id = 3', function (done) {
            request(app)
                .get('/api/authors/3')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var author = res.body.extras;
                    expect(author.firstName).to.equal('J.R.R');
                    expect(author.lastName).to.equal('Tolkien');
                })
                .end(done);
        });
        it('should not have field nationality if id = 2', function (done) {
            request(app)
                .get('/api/authors/3')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var author = res.body.extras;
                    expect(author.nationality).to.exists;
                })
                .end(done);
        });
        it('should return 404 when id = 8', function (done) {
            request(app)
                .get('/api/authors/8')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(404)
                .end(done);
        });
        it('should return 403 when try to edit author by not admin', function(done){
            request(app)
                .put('/api/authors/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 200 when try to edit author by admin', function(done){
            request(app)
                .put('/api/authors/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return edited authors lastName =  Sapkowski -> Sapekowski', function(done){
            request(app)
                .put('/api/authors/2', {lastName: 'Sapekowski'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var author = res.body.extras;
                    expect(author.lastName).to.equal('Sapekowski');
                })
                .end(done);
        });
        it('should return 403 when try delete author by not admin', function(done){
            request(app)
                .delete('/api/authors/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 200 when try delete author by admin', function(done){
            request(app)
                .delete('/api/authors/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(204)
                .end(done);
        });
        it('should return two books if id = 3', function (done) {
            request(app)
                .get('/api/authors/3/books')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var extras = res.body.extras;
                    expect(extras.author).to.exists;
                    expect(extras.books).to.exists;
                    expect(extras.books).to.have.length(2);
                })
                .end(done);
        });
    });
});
