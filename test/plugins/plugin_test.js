var assert = require('chai').assert,
    Stream = require('stream'),
    Bot    = require(process.cwd()+'/bot'),
    PluginCore = require('../../lib/plugin').Plugin;

describe('Plugin - Plugin', function() {

  var bot,
      s;

  it('Should be able to reaload a plugin', function(done) {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': ['privmsg'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    var TestPluginContructor = function TestPlugin() {
      this.pluginName = 'ping';
      this.listeners = {'PING': function PING() {
        done();
      }};
    };

    var TestPlugin = PluginCore.create(TestPluginContructor);
    var testPluginInstance = new TestPlugin(bot);

    testPluginInstance.On();
    bot.emit('PING');
    bot.connect();

    s.write(':eighty4!~eighty4@unaffiliated/eighty4 PRIVMSG ##botbotbot :!reload testplugin\r\n');
  });
});