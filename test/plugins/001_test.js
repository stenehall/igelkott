var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott');

describe('Plugin - 001', function() {

  var igelkott,
      s;

  it('Should JOIN all channels in config', function(done) {

    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({server: {channels: ['#one', '#two']}, plugins: ['001'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

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