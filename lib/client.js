var Net = require('net')
  , Util = require('util');

var Client = exports.Client = function Client (bot) {
  Net.Socket.call(this)
  this.bot = bot;
};
Util.inherits(Client, Net.Socket);

/*
 * Time to connect!
 */
Client.prototype.doConnect = function () {

  this.conn = this.connect(6667, 'chat.freenode.net').pipe(this.bot);

	this.conn.on('error', function(error) {
		console.log(error);
	});

  // Way to emit connect instead of via the pipe since it's not supporting it
  this.on('connect', function () {
    this.bot.emit('connect', arguments);
  });
}