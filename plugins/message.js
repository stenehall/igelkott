/*
 * @CorePlugin
 * @Description: Handles messages, should probably be directly in bot.js
 *
 * @Status: Very unstable
 */
 var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {message: 'message'};
  bot.pluginCore.apply(this, [bot]);

  this.message = function message (rawLine)
  {
    var message = this.bot.parseRaw(rawLine);
    this.bot.emit('cleanmessage', message);
    this.bot.emit(message.command, message);
  }.bind(this);
}