/*
 * @CorePlugin
 * @Description: Listens on 353 to keep track of users in channels
 *
 * @Status: Very unstable
 */
 var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {'353': '_353'};
  bot.pluginCore.apply(this, [bot]);

  this._353 = function _353 (message) {
    if ( ! this.bot.channels.getChannel(message.params[2]))
    {
      this.bot.channels.addChannel(message.params[2]);
    }

    message.message.split(' ').forEach(function (user) {
      this.bot.channels.getChannel(message.params[2]).users.addRawUser(user);
      this.bot.read('WHOIS '+user);
    }.bind(this));
  }.bind(this);
}