var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require("../bot")
  , PluginCore = require('../lib/plugin').Plugin;

describe("Plugin", function() {

  var bot,
      s,
      plugin;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': [], 'adapter': s, 'connect': function() { this.server.emit('connect')}});
    plugin = new PluginCore(bot);
  });

  describe("PluginHandler", function() {
    it("Should be able to load a plugin", function() {
      bot.plugin.load('privmsg');

      // Should also check require.cache
      assert.strictEqual(typeof bot.plugin.plugins['privmsg.js'], 'object');
    });

    it("Should be able to unload a plugin", function() {
      bot.plugin.load('privmsg');
      bot.plugin.unload('privmsg');

      assert.strictEqual(typeof bot.plugin.plugins['privmsg.js'], 'undefined');
    });
  });

  describe("TestPlugin", function() {
    it("Should be instance of both PluginCore and itself", function() {

      var TestPlugin = PluginCore.create(function TestPlugin() {
        this.pluginName = "ping";
        this.listeners = {'001': this.hello};
      });
      var testPluginInstance = new TestPlugin(bot);

      assert.strictEqual(testPluginInstance.pluginName, 'ping');
      assert.strictEqual(testPluginInstance.constructor, 'TestPlugin');
      assert.isTrue(testPluginInstance instanceof PluginCore);
      assert.isTrue(testPluginInstance instanceof TestPlugin);
      assert.property(testPluginInstance, 'listeners');
    });

    it("Should listen to added events", function(done) {
      this.PluginCore = new PluginCore();

      var TestPluginContructor = function TestPlugin() {
        this.pluginName = "ping";
        this.listeners = {'PING': function PING() {
          done();
        }};
      }

      var TestPlugin = PluginCore.create(TestPluginContructor);
      var testPluginInstance = new TestPlugin(bot);

      testPluginInstance.On();
      bot.emit('PING');
    });

    it("Should be able to add and remove event listeners", function() {
      this.PluginCore = new PluginCore();

      var TestPluginContructor = function TestPlugin() {
        this.pluginName = "ping";
        this.listeners = {'PING': this.PING};
      }
      var PING = TestPluginContructor.prototype.PING = function PING() {}
      var TestPlugin = PluginCore.create(TestPluginContructor);
      var testPluginInstance = new TestPlugin(bot);

      testPluginInstance.On(function() {
        assert.strictEqual(bot.listeners('PING').indexOf(PING), 0);
        testPluginInstance.Off(function() {
          assert.strictEqual(bot.listeners('PING').indexOf(PING), -1);
        });
      });
    });
  });

});