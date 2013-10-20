var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott');

describe('Plugin - ping', function() {

  var igelkott,
      s;

  it('Should correctly respond to PING', function(done) {
    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({'plugins': ['ping'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    igelkott.on('PONG', function(message) {
      assert.equal(message.parameters[0], 'brooks.freenode.net');
      done();
    });

    igelkott.connect();
    s.write('PING brooks.freenode.net\r\n');
  });
});