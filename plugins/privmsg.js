/*
 * @CorePlugin
 * @Description: Handles PRIVMSG
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {PRIVMSG: 'privmsg'};
  bot.pluginCore.apply(this, [bot]);

  // This is way horrible, it really is.
  this.privmsg = function privmsg (message) {

    var filter = new RegExp('^'+this.bot.config.trigger+'([^ ]*)');

    parts = message.message.match(filter);
    if (parts) // We have a server or a user
    {
      message.origin.channel = message.params[0];
      message.message = message.message.slice(parts[0].length+1);
      this.bot.emit(parts[1], message);
    }
  }.bind(this);
}