var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott'),
    PluginCore = require('../../lib/plugin').Plugin;

describe('Plugin - plugin', function() {

  var igelkott,
      s;

  it('Should be able to reaload a plugin', function(done) {
    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({'plugins': ['privmsg'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    var TestPluginContructor = function TestPlugin() {
      this.pluginName = 'ping';
      this.listeners = {'PING': function PING() {
        done();
      }};
    };

    var TestPlugin = PluginCore.create(TestPluginContructor);
    var testPluginInstance = new TestPlugin(igelkott);

    testPluginInstance.On();
    igelkott.emit('PING');
    igelkott.connect();

    s.write(':eighty4!~eighty4@unaffiliated/eighty4 PRIVMSG ##botbotbot :!reload testplugin\r\n');
  });
});