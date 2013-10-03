var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require(process.cwd()+"/bot");

describe("Plugin - 001", function() {

  var bot,
      s,
      plugin,
      host = 'brooks.freenode.net';

  it("Should JOIN all channels in config", function(done) {

    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({server: {channels: ['#one', '#two']}, plugins: ['001'], 'adapter': s, 'connect': function() { this.server.emit('connect')}});

    var channels = [];

    bot.on('JOIN', function(message) {
      channels.push(message.parameters[0]);
      if (channels.length == 2)
      {
        assert.deepEqual(channels, ['#one', '#two']);
        done();
      }
    });

    bot.connect();
    s.push(":cameron.freenode.net 001 jsmith :Welcome to the freenode Internet Relay Chat Network jsmith\r\n");

  });


});