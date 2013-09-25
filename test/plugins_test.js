var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require("../bot");

describe("Streams and Erk", function() {

  var bot
    , s;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'adapter': s, 'connect': function() { this.server.emit('connect')}});
  });

  describe("Connect", function() {
    it("Should emit connected if successful", function(done) {
      bot.on('connect', function() {
        assert(true);
        done();
      });
      bot.connect();
    });
  });

  describe("Ping pong", function() {
    it("Should get a PING event", function(done) {
      var command = 'PING';
      var server = 'chat.freenode.net';

      bot.on('PING', function(message) {
        assert.strictEqual(message.command, command);
        assert.strictEqual(message.parameters[0], server);
        done();
      });

      bot.on('connect', function() {
        s.push(command+' '+server+"\r\n");
      });
      bot.connect();
    });
  });

});