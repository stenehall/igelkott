/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */

var Ping = function Ping() {

  this.listeners = {PING: this.pong};

}


Ping.prototype.pong = function pong(message) {
  var message = { 'command': 'PONG', 'parameters': [ message.parameters[0] ] };
  this.bot.push(message);
}

exports.Plugin = Ping;