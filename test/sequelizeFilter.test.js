process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app.js');
var filter = require('../helpers/sequelizeFilter');

var possible = ['first', 'second'];

describe('SEQUELIZE FILTER', function(done){


    it('should return object with two fields', function(done){
        filter.strainObject({
                first: '1',
                second: '2',
                third: '3'
            }, possible,
            function(err, result){
                expect(err).to.not.exist;
                expect(result).to.exist;
                expect(result.first).to.exist;
                expect(result.second).to.exist;
                expect(result.third).not.to.exist;
                done();
            });
    });

    it('should return where object with two fields', function(done){
        filter.prepareWhere({
                first: '1',
                second: '2',
                third: '3'
            }, { available: possible } ,
            function(err, result){
                console.log(result);
                done();
            });
    });
});