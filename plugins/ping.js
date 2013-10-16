/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */

var Ping = function Ping() {
  this.listeners = {PING: this.pong};
};

Ping.prototype.pong = function pong(message) {
  var obj = { 'command': 'PONG', 'parameters': [ message.parameters[0] ] };
  this.bot.push(obj);
};

exports.Plugin = Ping;