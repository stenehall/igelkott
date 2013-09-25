var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require("../bot");

describe("Bot", function() {

  var bot;

  beforeEach(function() {
    bot = new Bot();
  });

  describe("New bot", function() {

    it("Should load config from directory", function() {
      assert.strictEqual(bot.config.server, "chat.freenode.net");
      assert.strictEqual(bot.config.port, 6667);
    });

    it("Should be able to overload settings", function() {
      bot = new Bot({'port': 7000});
      assert.strictEqual(bot.config.server, "chat.freenode.net");
      assert.strictEqual(bot.config.port, 7000);
    });

  });

  describe("Connect", function() {

    it("Should emit connected if successful", function(done) {
      var bot = new Bot({'adapter': new Stream.PassThrough, 'connect': function() { this.server.emit('connect')}})
      bot.on('connect', function() {
        assert(true);
        done();
      });
      bot.connect();
    });
  });

  describe("Piping as it should", function() {

    it("Should get a PING", function(done) {
      var s = new Stream.PassThrough;
      var command = 'PING';
      var server = 'chat.freenode.net';
      var bot = new Bot({'adapter': s, 'connect': function() { this.server.emit('connect')}})

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