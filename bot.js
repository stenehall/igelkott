var Stream = require('stream')
  , Util = require('util')
  , Fs = require('fs')
  , Path = require('path')
  , Client  = require('./lib/client.js').Client
  , Channel = require('./lib/channel.js').Channel
  , PluginHandler = require('./lib/pluginHandler.js').PluginHandler
  , PluginCore = require('./lib/pluginCore.js').pluginCore;

var Bot = module.exports = function Bot (configFile) {

  Stream.call(this);

  this.writable = true;
  this.readable = true;
  this.buffer = '';

  // Lets get us some settins.
  if (configFile === undefined)
  {
    configFile = Path.resolve(Path.dirname(require.main.filename), 'config.json');
  }

  var exists = Fs.existsSync(configFile);
  if ( ! exists)
  {
    console.log('Please copy the config.json file from the npm package to this directory and edit it as you like.');
    return false;
  }
  this.config = require(configFile);

  // Plugin helper function
  this.pluginCore = PluginCore;

  this.client = new Client(this);
  this.channels = new Channel;

  var DB = require('./lib/db/'+this.config.db.drivers+'.js').DB;

  this.db = new DB(this);
  this.db.setup(function (that) {
    that.pluginHandler = new PluginHandler(that);
  }(this));


};
Util.inherits(Bot, Stream.Stream);


/*
 * Parse a raw line into a message
 *
 */
Bot.prototype.parseRaw = function parseRaw (rawLine) {

  var message
    , parts
    , params
    , message = {
        command: null,
        params: [],
        origin: {
          raw: null,
          server: null,
          channel: null,
          user : {nick: null, user: null, host: null}},
        message: null,
        raw: null
      };

  message.raw = rawLine;

  parts = rawLine.match(/^:([^ ]*) /);
  if (parts) // We have a server or a user
  {
    rawLine = rawLine.slice(parts[0].length);
    message.origin.raw = parts[1];
    message = this.parseUser(message);
  }

  parts = rawLine.match(/^([^ ]*) /);
  if (parts) // Command
  {
    rawLine = rawLine.slice(parts[0].length);
    message.command = parts[1];
  }

  parts = rawLine.match(/([^:]*)/);
  if (parts) // Lets get all params to the command
  {
    // Should have just used split() :D
    params = parts[0].match(/[^ ]*/g).filter(function(n){return n});
    message.params = params;
    rawLine = rawLine.slice(parts[0].length);

  }

  parts = rawLine.match(/:([^\n\r]*)/);
  if (parts) // Message if any
  {
    message.message = parts[1];
  }

  return message;
}


/*
 * Takes a user OR server string and parses out a user OR a server from it.
 *
 * Horribly nasty solution but if it works... don't break it.
 */
Bot.prototype.parseUser = function parseUser (message) {
  var user = message.origin.raw.match(/^([^!]*)!([^@]+)@(.*)$/);
  if (user)
  {
    message.origin.user = {nick: user[1], user: user[2], host: user[3]};
  }
  else
  {
      // this is broken :/
      message.origin.server = message.origin.raw;
  }
  return message
}


/*
 * This just seems way wrong... but it's way to late to understand it now.
 */
Bot.prototype.read = function read () {
  var args = Array.prototype.slice.call(arguments);
  this.emit('read', args.join(' ')+"\r\n");
  this.client.write(args.join(' ')+"\r\n");
};


/*
 * Handles the raw stream from irc
 */
Bot.prototype.write = function write (buffer) {

  var index
    , message
    , raw = buffer.toString();

  if (raw.length >= 1448)
  {
    raw = raw.substring(0, 1446);
  }

  this.buffer += raw;
  while ((index = this.buffer.indexOf('\r\n')) && index > 1)
  {
    message = this.buffer.substring(0, index);
    this.buffer = this.buffer.substring(index+2);
    this.emit('message', message);
  }
};


/*
 * We're connected!
 */
Bot.prototype.connect = function connect () {
  if (this.client !== undefined)
  {
    this.client.doConnect();
  }
}


/*
 * We are ending
 */
Bot.prototype.end = function connect () {
  console.log('Time to sleep...');
}