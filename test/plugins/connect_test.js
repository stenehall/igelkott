var assert = require('chai').assert,
    Stream = require('stream'),
    Bot    = require(process.cwd()+'/bot');

describe('Plugin - connect', function() {

  it('Should emit NICK on connect', function(done) {

    var s = new Stream.PassThrough({objectMode: true});
    var bot = new Bot({'plugins': ['connect'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    bot.on('NICK', function(message) {
      assert.equal(message.parameters[0], this.config.server.nick);
      done();
    });
    bot.connect();
  });


});