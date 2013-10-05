var assert = require('chai').assert,
    Stream = require('stream'),
    Bot    = require(process.cwd()+'/bot');

describe('Plugin - PING', function() {

  var bot,
      s;

  it('Should correctly respond to PING', function(done) {

    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': ['ping'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    bot.on('PONG', function(message) {
      assert.equal(message.parameters[0], 'brooks.freenode.net');
      done();
    });

    bot.connect();
    s.write('PING brooks.freenode.net\r\n');
  });


});