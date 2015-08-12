process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var models = require("../models");

var correctNewBook = {
    title: 'Niezgodna',
    publishYear: 2010,
    author: 1,
    collection: 2
};

var incorrectNewBook1 = {
    tile: 'Niezgodna',
    author: 1,
    collection: 2
};

describe('BOOKS', function () {

    before(function (done) {
        models.sequelize.sync({force: true}).then(function() {
            seqFixtures.loadFixtures( require('../test/fixtures/fixtures'), models )
                .then(function(){
                    done();
                });
        });
    });

    describe('[/api/books]', function(done){
        it('should return 200 with authorization header', function (done) {
            request(app)
                .get('/api/books')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 401 without authorization header', function (done) {
            request(app)
                .get('/api/books')
                .set('Content-Type', 'application/json')
                .send()
                .expect(401)
                .end(done);
        });
        it('should return 2 books', function (done) {
            request(app)
                .get('/api/books')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var body = res.body;
                    expect(body.extras.authors).to.have.length(2);
                })
                .end(done);
        });
        it('should first books author be Tolkien', function (done) {
            request(app)
                .get('/api/books')
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
        it('should return 201 when correct POST body and should return new book with year 2010', function (done) {
            request(app)
                .post('/api/books')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send(correctNewBook)
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
                .post('/api/books')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send(incorrectNewBook1)
                .expect(400)
                .end(done);
        });
    });
    describe('[/api/books/:id]', function(done){
        it('should return 200 if id = 1', function (done) {
            request(app)
                .get('/api/books/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return book of Tolkien when id = 1', function (done) {
            request(app)
                .get('/api/books/3')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var book = res.body.extras;
                    expect(book.author.firstName).to.equal('J.R.R');
                    expect(book.author.lastName).to.equal('Tolkien');
                })
                .end(done);
        });
        it('should not have field publishYear if id = 2', function (done) {
            request(app)
                .get('/api/books/2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var book = res.body.extras;
                    expect(book.publishYear).not.to.exists;
                })
                .end(done);
        });
        it('should return 404 when id = 8', function (done) {
            request(app)
                .get('/api/books/8')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(404)
                .end(done);
        });
        it('should return 200 when try to edit author by admin', function(done){
            request(app)
                .put('/api/books/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
        it('should return 403 when try to edit title by not creator', function(done){
            request(app)
                .put('/api/books/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 403 when try to edit anything by user out of collection', function(done){
            request(app)
                .put('/api/books/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 403 when try to edit collection by not an admin', function(done){
            request(app)
                .put('/api/books/1', {firstName: 'Henio'})
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(403)
                .end(done);
        });
        it('should return 403 when try delete author by not admin', function(done){
            request(app)
                .delete('/api/books/1')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8')
                .send()
                .expect(403)
                .end(done);
        });
    });
});
