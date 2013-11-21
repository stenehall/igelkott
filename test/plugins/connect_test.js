var assert = require('chai').assert,
Stream = require('stream'),
Igelkott    = require(process.cwd()+'/igelkott'),
Connect = require('../../plugins/connect.js').Plugin;

describe('Plugin - connect', function() {

  it('Should emit NICK on connect', function(done) {

    var igelkott,
    config,
    s,
    server;

    s = new Stream.PassThrough({objectMode: true});

    config = {
      core: [],
      plugins: {},
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
    igelkott.plugin.load('connect', {}, Connect);

    igelkott.on('NICK', function(message) {
      assert.equal(message.parameters[0], this.config.server.nick);
      done();
    });
    igelkott.connect();
  });
});
