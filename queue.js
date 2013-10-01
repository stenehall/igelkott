var stream = require('stream');
var _ = require('underscore');

var s = new stream.PassThrough;


var Stream = require('stream')
  , Erk = require('erk')
  , s = new Stream.PassThrough;


var queue = function queue() {

  var queue = {};
  var commands = {};

  this.addCommand = function addCommand(command, callback) {
    commands[command] = callback;
  };

  this.getCommand = function getCommand(command) {
    return commands[command];
  }

  this.add = function add(obj) {
    if(queue[obj.command] === undefined)
    {
      queue[obj.command] = [];
    }
    queue[obj.command].push(obj);
  }

  this.get = function get(command) {

    if(queue[command] !== undefined)
    {
      return queue[command];
    }
    return false;
  }

}

var Bot = module.exports = function Bot (config) {

  Stream.Duplex.call(this, {objectMode: true});

  this.parser = new Erk.Parser();
  this.composer = new Erk.Composer();

  this.queue = new queue;

  // This would be done in a plugin that needs a 330.
  this.queue.addCommand('330', function(command, message) {
    return (command.message.prefix.nick === message.parameters[2]);
  });


    this.queue.addCommand('333', function(command, message) {

    console.log('########## SHOULD NEVER BE CALLED ##############');
    return (command.message.prefix.nick === message.parameters[2]);
  });

  this._read = function _read(size) {}

  this._write = function _write(message, enc, done) {
    this.handleQueue(message);
    this.emit(message.command, message);
    console.log(JSON.stringify(message));
    done();
  }

  this.on('PRIVMSG', function(message) {
    this.emit(message.parameters[1], message);
  }.bind(this));

  // This would be in the plugin as well
  this.on('!kick', function(message) {
    var obj = JSON.parse(JSON.stringify(message));
    obj.parameters = [message.parameters[0], 'kick', message.parameters[2]];
    this.queue.add({command:'330', message: obj});
  });

  this.handleQueue = function handleQueue(message) {
    if(commands = this.queue.get(message.command))
    {
      var action = this.queue.getCommand(message.command);
      commands.forEach(function(command) {
        if(action(command, message))
        {
          commands.pop(); // remove the command
          b.push(command.message);
        }
      });
    }
  }

  this.pipe(this.composer).pipe(s).pipe(this.parser).pipe(this);
};
Bot.prototype = Object.create(Stream.Duplex.prototype, {constructor: {value: Bot}});

var b = new Bot();

s.push(":eighty4!~eighty4@unaffiliated/eighty4 PRIVMSG #noweb !kick foobar\r\n");
setTimeout(function() {
  s.push(":hobana.freenode.net 330 atti Emn1ty Emn1ty :is logged in as\r\n");
  s.push(":hobana.freenode.net 330 atti eighty4 eighty4 :is logged in as\r\n");
  s.push(":hobana.freenode.net 330 atti eighty4 eighty4 :is logged in as\r\n");
}, 2000);