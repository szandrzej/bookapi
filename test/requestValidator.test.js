process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var requestValidator = require('../helpers/requestValidator');

var requiredFields = ['first', 'second', 'third'];

describe('REQUEST VALIDATOR', function(done){


    it('should return true if object has all required properties', function(done){
        requestValidator.checkRequiredFields({
                first: '1',
                second: '2',
                third: '3'
            }, requiredFields,
            function(err, result){
                expect(err).to.not.exist;
                expect(result).to.be.equal(true);
                done();
            });
    });
    it('should return true if object has more than required properties', function(done){
        requestValidator.checkRequiredFields({
                first: '1',
                second: '2',
                third: '3',
                fourth: '4'
            }, requiredFields,
            function(err, result){
                expect(err).to.not.exist;
                expect(result).to.be.equal(true);
                done();
            });
    });
    it('should return errors array if object doesnt have all required properties', function(done){
        requestValidator.checkRequiredFields({
                first: '1',
                second: '2'
            }, requiredFields,
            function(err, result){
                expect(err).to.exist;
                expect(err.errors).to.be.array;
                expect(result).to.not.exist;
                done();
            });
    });
    it('should return error if object is empty', function(done){
        requestValidator.checkRequiredFields({}, requiredFields,
            function(err, result){
                expect(err).to.exist;
                expect(err.errors).to.be.array;
                expect(err.errors.length).to.be.equal(1);
                expect(result).to.not.exist;
                done();
            });
    });
    it('should return error if object is null', function(done){
        requestValidator.checkRequiredFields(null, requiredFields,
            function(err, result){
                expect(err).to.exist;
                expect(err.errors).to.be.array;
                expect(err.errors.length).to.be.equal(1);
                expect(result).to.not.exist;
                done();
            });
    });
});