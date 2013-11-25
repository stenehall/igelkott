var assert = require('chai').assert,
Stream = require('stream'),
Igelkott    = require(process.cwd()+'/igelkott'),
_433 = require('../../plugins/433').Plugin;

describe('Plugin - 433', function() {

  var igelkott,
  config,
  s,
  server;

  it('Should add a _ to nick if we get 433 and then send connect again', function(done) {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      core: [],
      plugins: {},
      server: {
        nick: "sonic",
      },
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
    igelkott.plugin.load('433', {}, _433);

    igelkott.on('connect', function() { // Horrible solution, needs something better
      igelkott.on('connect', function() {
        assert.equal(config.server.nick, 'sonic_');
        done();
      });
    });

    igelkott.connect();
    s.write(':cameron.freenode.net 433\r\n');
  });
});
