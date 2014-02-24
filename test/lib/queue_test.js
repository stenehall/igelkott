var assert = require('chai').assert,
Stream = require('stream'),
Igelkott = require('../../igelkott'),
PluginCore = require('../../lib/plugin').Plugin,
queue = require('../../lib/queue.js');

describe('Queue', function() {

  var igelkott,
  config,
  s;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});

    config = {
      trigger: "!",
      core: [],
      plugins: {},
      'adapter': s, 'connect': function() { this.server.emit('connect'); }
    };
    igelkott = new Igelkott(config);
  });

  describe('Add trigger, find trigger, kick user', function() {

    it('Should be able to add to add to the queue', function() {
      var q = new queue.Queue();

      assert.ok(q.add({foo: 'bar'}));
    });

    it('Should be able to remove an added object to the queue', function() {
      var q = new queue.Queue();

      assert.ok(q.add({foo: 'bar'}));
    });


    it('Should kick jsmith', function(done) {

      igelkott.load('privmsg');

      var TestPluginContructor = function TestPlugin() {
        this.pluginName = 'ping';
        this.listeners = {'trigger:kick': this.kick};
      };

      TestPluginContructor.prototype.kick = function kick(message) {
        var obj = {
          prefix : message.prefix,
          command: 'KICK',
          parameters : [message.parameters[0], 'kick', message.parameters[1].split(' ')[1]]
        };

        this.igelkott.queue.add({trigger: function(command, message) {
          return (command.message.prefix.nick === message.parameters[2]);
        } , 'message': obj});
      };

      var TestPlugin = PluginCore.create(TestPluginContructor);
      var testPluginInstance = new TestPlugin(igelkott);

      testPluginInstance.On();
      igelkott.on('KICK', function(message) {
        assert.equal(message.prefix.nick, 'fsmith');
        assert.equal(message.parameters[1], 'kick');
        assert.equal(message.parameters[2], 'jsmith');
        done();
      });
      igelkott.connect();

      s.write(':fsmith!~fsmith@unaffiliated/fsmith PRIVMSG #noweb :!kick jsmith\r\n');
      setTimeout(function() {
        // Start of by sanding the wrong data
        s.write(':hobana.freenode.net 330 atti asmith asmith :is logged in as\r\n');
        s.write(':hobana.freenode.net 330 atti fsmith fsmith :is logged in as\r\n');
      }, 100);
    });
  });
});

