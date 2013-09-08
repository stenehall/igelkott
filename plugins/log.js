/*
 * @CorePlugin
 * @Description: Logs everythings that's happening
 *
 * @Status: Very unstable
 */
var Fs = require('fs')
  , Colors = require('colors');


var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {read: 'read', message: 'message'};
  bot.pluginCore.apply(this, [bot]);

  // Lets create the db folder if it doesn't exist
  Fs.stat('./db', function(err, stat) {
    if(err != undefined && err.code === 'ENOENT')
    {
        Fs.mkdir('db');
    }
  });

  this.read = function read (message) {
    var log = "Sending   > " + message.replace("\r\n",'');
    console.log(log.green);
    Fs.appendFile("./db/log", message + "\n");
  }.bind(this);


  this.message = function message (message) {
    var log = "Receiving < " + message.replace("\r\n",'');
    console.log(log.cyan);
    Fs.appendFile("./db/log", message + "\n");
  }.bind(this);
}
