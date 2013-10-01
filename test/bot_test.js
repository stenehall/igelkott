var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require("../bot");

describe("Bot", function() {

  var bot;

  beforeEach(function() {
    bot = new Bot({'loadPlugins': false});
  });

  describe("New bot", function() {
    it("Should load config from directory", function() {
      assert.strictEqual(bot.config.server, "chat.freenode.net");
      assert.strictEqual(bot.config.port, 6667);
    });

    it("Should be able to overload settings", function() {
      bot = new Bot({'loadPlugins': false, 'port': 7000});
      assert.strictEqual(bot.config.server, "chat.freenode.net");
      assert.strictEqual(bot.config.port, 7000);
    });
  });

  describe("Connect", function() {
    it("Should emit connected if successful", function(done) {
      var bot = new Bot({'loadPlugins': false, 'adapter': new Stream.PassThrough, 'connect': function() { this.server.emit('connect')}})
      bot.on('connect', function() {
        assert(true);
        done();
      });
      bot.connect();
    });
  });

});