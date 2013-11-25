var assert = require('chai').assert,
Stream = require('stream'),
Igelkott = require("../igelkott");

describe('Igelkott', function() {

  var igelkott;

  describe('New igelkott', function() {
    it('Should load config from directory', function() {
      igelkott = new Igelkott({'plugins': []});
      assert.strictEqual(igelkott.config.server.host, 'chat.freenode.net');
      assert.strictEqual(igelkott.config.server.port, 6667);
    });

    it('Should be able to overload settings', function() {
      igelkott = new Igelkott({'plugins': [], server: {port: 7000, host: 'chat.freenode.net'}});
      assert.strictEqual(igelkott.config.server.host, 'chat.freenode.net');
      assert.strictEqual(igelkott.config.server.port, 7000);
    });
  });

  describe('Connect', function() {
    it('Should emit connected if successful', function(done) {
      igelkott = new Igelkott({'plugins': [], 'adapter': new Stream.PassThrough(), 'connect': function() { this.server.emit('connect');}});
      igelkott.on('connect', function() {
        assert(true);
        done();
      });
      igelkott.connect();
    });
  });
});
