process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var models = require("../models");

describe('Authors [/api/authors]', function () {

    before(function (done) {
        models.sequelize.sync({force: true}).then(function(){
            models.Author.create({
                firstName: "Andrzej",
                lastName: "Sapkowski"
            }).then(function(){
                done();
            });
        });
    });

    it('should return one author', function (done) {
        request(app)
            .get('/api/authors')
            .set('Content-Type', 'application/json')
            .send()
            .expect(function(res){
                var body = res.body;
                expect(body.extras.authors).to.have.length(1);
            })
            .end(done);
    });
});

