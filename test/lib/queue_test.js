var assert = require('chai').assert,
    Stream = require('stream'),
    Bot    = require('../../bot'),
    PluginCore = require('../../lib/plugin').Plugin,
    queue = require('../../lib/queue.js');

describe('Queue', function() {

  var bot,
      s;

  beforeEach(function() {
    s = new Stream.PassThrough({objectMode: true});
    bot = new Bot({'plugins': [], 'adapter': s, 'connect': function() { this.server.emit('connect'); }});
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

      bot.plugin.load('privmsg.js');

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

        this.bot.queue.add({trigger: function(command, message) {
          return (command.message.prefix.nick === message.parameters[2]);
        } , 'message': obj});
      };

      var TestPlugin = PluginCore.create(TestPluginContructor);
      var testPluginInstance = new TestPlugin(bot);

      testPluginInstance.On();
      bot.on('KICK', function(message) {
        assert.equal(message.prefix.nick, 'fsmith');
        assert.equal(message.parameters[1], 'kick');
        assert.equal(message.parameters[2], 'jsmith');
        done();
      });
      bot.connect();

      s.write(':fsmith!~fsmith@unaffiliated/fsmith PRIVMSG #noweb :!kick jsmith\r\n');
      setTimeout(function() {
        // Start of by sanding the wrong data
        s.write(':hobana.freenode.net 330 atti asmith asmith :is logged in as\r\n');
        s.write(':hobana.freenode.net 330 atti fsmith fsmith :is logged in as\r\n');
      }, 100);
    });

  });

});