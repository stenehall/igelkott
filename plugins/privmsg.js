  /*
 * @CorePlugin
 * @Description: Handles PRIVMSG
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.dbConfig = {
    tables: {
      'karma': 'id',
    }
  }

  this.listeners = {PRIVMSG: 'privmsg'};
  bot.pluginCore.apply(this, [bot]);

  // This is way horrible, it really is.
  this.privmsg = function privmsg (message) {

    var filter = new RegExp('^'+this.bot.config.trigger+'([^ ]*)');

    trigger = message.parameters[1].match(filter);
    if (trigger) // We have a server or a user
    {
      this.bot.emit(trigger[1], message);
    }
  }.bind(this);
}