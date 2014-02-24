var assert = require('chai').assert,
Stream = require('stream'),
Igelkott = require("../igelkott");

describe('Igelkott', function() {

  var igelkott;

  describe('New igelkott', function() {

    it('Should be able to create a new igelkott with a minimal config', function() {
      igelkott = new Igelkott({'plugins': []});
    });

    it('Should throw error on missing plugins for config', function() {
      assert.throws(Igelkott, Error);
    });

  });

  describe('Connect', function() {

    it('Should emit connected if successful', function(done) {
      igelkott = new Igelkott({'core': [], 'plugins': [], 'adapter': new Stream.PassThrough(), 'connect': function() { this.server.emit('connect');}});
      igelkott.on('connect', function() {
        assert(true);
        done();
      });
      igelkott.connect();
    });

  });

});
