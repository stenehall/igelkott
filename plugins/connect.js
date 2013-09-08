/*
 * @CorePlugin
 * @Description: Joins channels and sets nick on connect, should probably be in
 * bot.js
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {connect: 'connect'};
  bot.pluginCore.apply(this, [bot]);

  this.connect = function connect ()
  {
    // Time to join some channels so we can play!
    this.bot.read('NICK', this.bot.config.nick);
    this.bot.read('USER', this.bot.config.nick, '0', '*', ':' + this.bot.config.nick);
  }.bind(this);
}