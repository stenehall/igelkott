var assert = require('chai').assert,
    Stream = require('stream'),
    Bot = require("../bot");

describe("Bot", function() {

  var bot;

  beforeEach(function() {
    bot = new Bot({'plugins': []});
  });

  describe("New bot", function() {
    it("Should load config from directory", function() {
      assert.strictEqual(bot.config.server.host, "chat.freenode.net");
      assert.strictEqual(bot.config.server.port, 6667);
    });

    it("Should be able to overload settings", function() {
      bot = new Bot({'plugins': [], server: {port: 7000, host: 'chat.freenode.net'}});
      assert.strictEqual(bot.config.server.host, "chat.freenode.net");
      assert.strictEqual(bot.config.server.port, 7000);
    });
  });

  describe("Connect", function() {
    it("Should emit connected if successful", function(done) {
      var bot = new Bot({'plugins': [], 'adapter': new Stream.PassThrough, 'connect': function() { this.server.emit('connect')}})
      bot.on('connect', function() {
        assert(true);
        done();
      });
      bot.connect();
    });
  });

});