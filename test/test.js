var expect = require('chai').expect;
var app = require('../server');
var request = require('supertest');

describe('GET /', function(){
  it('responds with success', function(done){
    request(app).get('/')
                .expect(200, done);
  });
});

describe('unknown route', function(){
  it('returns a 404', function(done){
    request(app).get('/fake')
                .expect(404, done);
  });
});
