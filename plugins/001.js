/*
 * @CorePlugin
 * @Description: Listens on 001 after that it should be safe to join
 *
 * @Status: Very unstable
 */
 var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {'001': '_001'};
  bot.pluginCore.apply(this, [bot]);

  this._001 = function _001 (message) {
    this.bot.config.channels.forEach(function (channel) {
      var message = {'command': 'JOIN', 'parameters': [ channel ]};
      this.bot.push(message);
    }, this);

    // Lets find out if we have identified users.
    for (admin in this.bot.config.admins)
    {
      var message = {'command': 'WHOIS', 'parameters': [ admin ]};
      this.bot.push(message);
    }
    this.bot.read('WHOIS', this.bot.config.nick);
  }.bind(this);
}