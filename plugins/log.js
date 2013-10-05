  /*
 * @CorePlugin
 * @Description: Logs everythings that's happening
 *
 * @Status: Very unstable
 */
var Fs = require('fs'),
    Colors = require('colors');


var Log = function Log (bot) {

  this.listeners = {sending: this.sending, receiving: this.receiving};

  // Lets create the db folder if it doesn't exist
  Fs.stat('./db', function(err, stat) {
    if(err != undefined && err.code === 'ENOENT')
    {
        Fs.mkdir('db');
    }
  });

  this.bot.composer.on('data', function(message) {
    this.bot.emit('sending', message);
  }.bind(this));

  this.bot.parser.on('data', function(message) {
    this.bot.emit('receiving', message);
  }.bind(this));
}

Log.prototype.sending = function sending (message) {
  var log = "Sending   > " + message.toString().replace("\r\n",'');
  console.log(log.green);
  Fs.appendFile("./db/log", message.toString().replace("\r\n",'') + "\n");
}.bind(this);

Log.prototype.receiving = function receiving (message) {
  var log = "Receiving < " + message.toString().replace("\r\n",'');
  console.log(log.cyan);
  Fs.appendFile("./db/log", message.toString().replace("\r\n",'') + "\n");
}.bind(this);


exports.Plugin = Log;