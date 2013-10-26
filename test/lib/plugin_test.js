var assert = require('chai').assert,
    Stream = require('stream'),
    Igelkott    = require('../../igelkott'),
    PluginCore = require('../../lib/plugin').Plugin;

describe('Plugin', function() {

  var igelkott,
      s,
      plugin;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    igelkott = new Igelkott({'plugins': [], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});
    plugin = new PluginCore(igelkott);
  });

  describe('PluginHandler', function() {
    it('Should be able to load a plugin', function() {
      igelkott.plugin.tryToLoad('privmsg');

      // Should also check require.cache
      assert.strictEqual(typeof igelkott.plugin.plugins['privmsg'], 'object');
    });

    it('Should be able to unload a plugin', function() {
      igelkott.plugin.tryToLoad('privmsg');
      igelkott.plugin.unload('privmsg');

      assert.strictEqual(typeof igelkott.plugin.plugins['privmsg'], 'undefined');
    });
  });

  describe('TestPlugin', function() {
    it('Should be instance of both PluginCore and itself', function() {

      var TestPlugin = PluginCore.create(function TestPlugin() {
        this.pluginName = 'ping';
        this.listeners = {'001': this.hello};
      });
      var testPluginInstance = new TestPlugin(igelkott);

      assert.strictEqual(testPluginInstance.pluginName, 'ping');
      assert.strictEqual(testPluginInstance.constructor, 'TestPlugin');
      assert.isTrue(testPluginInstance instanceof PluginCore);
      assert.isTrue(testPluginInstance instanceof TestPlugin);
      assert.property(testPluginInstance, 'listeners');
    });

    it('Should listen to added events', function(done) {

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
    });

    it('Should be able to add and remove event listeners', function() {
      this.PluginCore = new PluginCore(igelkott);

      var TestPluginContructor = function TestPlugin() {
        this.pluginName = 'ping';
        this.listeners = {'PING': this.PING};
      };
      var PING = TestPluginContructor.prototype.PING = function PING() {};
      var TestPlugin = PluginCore.create(TestPluginContructor);
      var testPluginInstance = new TestPlugin(igelkott);

      testPluginInstance.On(function() {
        assert.strictEqual(typeof igelkott.listeners('PING')[0], 'function');
        testPluginInstance.Off(function() {
          assert.strictEqual(igelkott.listeners('PING').length, 0);
        });
      });
    });
  });

});