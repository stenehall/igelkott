var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require(process.cwd()+"/bot");

describe("Plugin - PING", function() {

  var bot,
      s,
      plugin,
      host = 'brooks.freenode.net';

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': ['ping'], 'adapter': s, 'connect': function() { this.server.emit('connect')}});
  });

  it("Should correctly respond to PING", function(done) {

    bot.on('PONG', function(message) {
      assert.equal(message.parameters[0], host);
      done();
    });

    bot.connect();
    s.push("PING "+host+"\r\n");
  });


});