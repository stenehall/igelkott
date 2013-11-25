var assert = require('chai').assert,
Stream = require('stream'),
Igelkott    = require(process.cwd()+'/igelkott'),
Ping = require('../../plugins/ping.js').Plugin;

describe('Plugin - ping', function() {

  var igelkott,
  config,
  s,
  server;

  it('Should correctly respond to PING', function(done) {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      core: [],
      plugins: {},
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
    igelkott.plugin.load('ping', {}, Ping);

    igelkott.on('PONG', function(message) {
      assert.equal(message.parameters[0], 'brooks.freenode.net');
      done();
    });

    igelkott.connect();
    s.write('PING brooks.freenode.net\r\n');
  });
});