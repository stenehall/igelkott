var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require(process.cwd()+"/bot");

describe("Plugin - 001", function() {

  var bot,
      s,
      plugin,
      host = 'brooks.freenode.net';

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({server: {channels: ['#one', '#two']}, plugins: ['001'], 'adapter': s, 'connect': function() { this.server.emit('connect')}});
  });

  it("Should JOIN all channels in config", function(done) {

    var channels = [];

    bot.on('JOIN', function(message) {
      channels.push(message.parameters[0]);

      if (channels.length == bot.config.server.channels.length)
      {
        assert.equal(channels.toString(), bot.config.server.channels.toString());
        done();
      }
    });

    bot.connect();
    s.push(":cameron.freenode.net 001 jsmith :Welcome to the freenode Internet Relay Chat Network jsmith\r\n");

  });


});