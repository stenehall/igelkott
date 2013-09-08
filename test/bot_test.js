var assert = require('chai').assert
  , Path = require('path');

describe('Bot', function(){

  var Bot = require('../bot');
  var bot;

  beforeEach(function() {
    var configFile = Path.resolve('config.json');
    bot = new Bot(configFile)
  });

  it("#parseRaw(...)      - 311", function(done) {
    var raw = ':wolfe.freenode.net 311 atti eighty4 ~eighty4 unaffiliated/eighty4 * :eighty4';
    var result = bot.parseRaw(raw);

    assert.equal(result.command, '311');
    assert.equal(result.origin.server, 'wolfe.freenode.net')

    done();
  });

  it("#parseRaw(...)      - PING - PONG", function(done) {
    var raw = 'PING :wolfe.freenode.net';
    var result = bot.parseRaw(raw);

    assert.equal(result.command, 'PING');

    done();
  });


  it("#parseRaw(...)      - Logged in", function(done) {
    var raw = ':leguin.freenode.net 330 atti eighty4 eighty4 :is logged in as';
    var result = bot.parseRaw(raw);
    assert.equal(result.command, '330');

    done();
  });


  it("#parseRaw(...)      - JOIN:ing channel", function(done) {
    var raw = ':atti!~atti@foo.bar.tld JOIN ##your-channel';
    var result = bot.parseRaw(raw);

    assert.equal(result.command, 'JOIN');
    assert.equal(result.origin.user.nick, 'atti');

    done();
  });


  it("#parseRaw(...)      - NOTICE", function(done) {
    var raw = ':wolfe.freenode.net NOTICE * :*** Looking up your hostname...';
    var result = bot.parseRaw(raw);

    assert.equal(result.command, 'NOTICE');

    done();
  });

  it("#parseRaw(...)      - PRIVMSG", function(done) {
    var raw = 'PRIVMSG ##your-channel :your-user: Yeah!';
    var result = bot.parseRaw(raw);

    assert.equal(result.origin.server, null);
    assert.equal(result.command, 'PRIVMSG');
    assert.equal(result.message, 'your-user: Yeah!')
    done();
  });

})