var assert = require('chai').assert
  , Stream = require('stream')
  , Bot    = require("../bot")
  , PluginCore = require('../lib/pluginCore').Plugin;

describe("Plugin", function() {

  var bot
    , s
    , plugin;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'loadPlugins': false, 'adapter': s, 'connect': function() { this.server.emit('connect')}});
    plugin = new PluginCore(bot);
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