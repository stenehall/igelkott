var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott');

describe('Plugin - connect', function() {

  it('Should emit NICK on connect', function(done) {

    var s = new Stream.PassThrough({objectMode: true});
    var igelkott = new Igelkott({'plugins': ['connect'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    igelkott.on('NICK', function(message) {
      assert.equal(message.parameters[0], this.config.server.nick);
      done();
    });
    igelkott.connect();
  });


});