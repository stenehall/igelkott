var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require(process.cwd()+'/igelkott'),
    PluginCore = require('../../lib/plugin').Plugin;

describe('Plugin - help', function() {

  var igelkott,
      s;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({'plugins': ['privmsg', 'help'], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});

    this.PluginCore = new PluginCore(igelkott);
    var TestPluginContructor = function TestPlugin() {
      this.pluginName = 'testplugin';
      this.help = {
        "default": "Hello",
        "foo": {
          "default": "bar"
        }
      }
    };

    var TestPlugin = PluginCore.create(TestPluginContructor);
    var testPluginInstance = new TestPlugin(igelkott);
    igelkott.plugin.plugins['testplugin'] = testPluginInstance;
    testPluginInstance.On();
    igelkott.connect();
  });

  it('Should return list of loaded plugins if no plugin name is pased', function(done) {
    igelkott.once('PRIVMSG', function(message) {
      assert.equal(message.parameters[1], 'You have the following plugins to play with: privmsg, help');
      done();
    });
    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!help\r\n');
  });

  it('Should return the default help if no extra parameters are pasts', function(done) {
    igelkott.once('PRIVMSG', function(message) {
      assert.equal(message.parameters[1], 'Help for testplugin: Hello');
      done();
    });

    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!help testplugin\r\n');
  });


  it('Should return the foos help for testplugin', function(done) {
    igelkott.once('PRIVMSG', function(message) {
      assert.equal(message.parameters[1], 'Help for testplugin->foo: bar');
      done();
    });

    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!help testplugin foo\r\n');
  });

  it('Should return error message on missing plugin', function(done) {
    igelkott.once('PRIVMSG', function(message) {
      assert.equal(message.parameters[1], 'No plugin named noplugin.js');
      done();
    });

    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!help noplugin\r\n');
  });

  it('Should return info about missing help text', function(done) {
    igelkott.once('PRIVMSG', function(message) {
      assert.equal(message.parameters[1], 'No help for testplugin->foo->bar');
      done();
    });

    s.write(':jsmith!~jsmith@unaffiliated/jsmith PRIVMSG #channel :!help testplugin foo bar\r\n');
  });

});