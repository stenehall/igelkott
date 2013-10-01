/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */
 var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {PING: 'pong'};
  bot.pluginCore.apply(this, [bot]);

  this.pong = function pong (message) {

    var message = { 'command': 'PONG', 'parameters': [ message.parameters[0] ] };
    this.bot.push(message);
  }.bind(this);
}