var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott'),
    _001 = require('../../plugins/001').Plugin;

describe('Plugin - 001', function() {

  var igelkott,
  config,
  s,
  server;

  it('Should JOIN all channels in config', function(done) {

    s = new Stream.PassThrough({objectMode: true});
    config = {
      core:[],
      plugins: {},
      server: {
        channels: ['#one', '#two'],
      },
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };

    igelkott = new Igelkott(config);
    igelkott.plugin.load('001', {}, _001);

    var channels = [];

    igelkott.on('JOIN', function(message) {
      channels.push(message.parameters[0]);
      if (channels.length == 2)
      {
        assert.deepEqual(channels, ['#one', '#two']);
        done();
      }
    });

    igelkott.connect();
    s.write(':cameron.freenode.net 001 jsmith :Welcome to the freenode Internet Relay Chat Network jsmith\r\n');

  });


});