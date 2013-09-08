/*
 * @CorePlugin
 * @Description: Listens on 433 to fix existing nicknames
 *
 * @Status: Very unstable
 */
 var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {'433': '_433'};
  bot.pluginCore.apply(this, [bot]);

  this._433 = function _433 (message) {
    this.bot.config.nick = this.bot.config.nick+'_';
    this.bot.read('NICK', this.bot.config.nick);
  }.bind(this);
}