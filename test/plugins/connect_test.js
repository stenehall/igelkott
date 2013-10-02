var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require(process.cwd()+"/bot");

describe("Plugin - connect", function() {

  var bot,
      s,
      plugin;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': ['connect'], 'adapter': s, 'connect': function() { this.server.emit('connect')}});
  });

  it("Should emit NICK on connect", function(done) {
    bot.on('NICK', function(message) {
      assert.equal(message.parameters[0], this.config.server.nick);
      done();
    });
    bot.connect();
  });


});