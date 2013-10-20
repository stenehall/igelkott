var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott');

describe('Plugin - privmsg', function() {

  var igelkott,
      s;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({'plugins': ['privmsg'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});
  });

  it('Should trigger on PRIVMSG', function(done) {
    igelkott.on('PRIVMSG', function(message) {
      assert.equal(message.parameters[0], '#channel');
      assert.equal(message.parameters[1], 'hello!');
      assert.equal(message.prefix.nick, 'jsmith');
      assert.equal(message.prefix.user, '~jsmith');
      assert.equal(message.prefix.host, 'unaffiliated/jsmith');
      done();
    });

    igelkott.connect();
    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :hello!\r\n');
  });

  it('Should emit trigger:command', function(done) {
    igelkott.on('trigger:kick', function(message) {
      assert.equal(message.parameters[0], '#channel');
      assert.equal(message.parameters[1], '!kick fsmith');
      assert.equal(message.prefix.nick, 'jsmith');
      assert.equal(message.prefix.user, '~jsmith');
      assert.equal(message.prefix.host, 'unaffiliated/jsmith');
      done();
    });

    igelkott.connect();
    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!kick fsmith\r\n');
  });

});