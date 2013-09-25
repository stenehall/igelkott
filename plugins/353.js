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

    if ( ! this.bot.channels.getChannel(message.parameters[2]))
    {
      this.bot.channels.addChannel(message.parameters[2]);
    }

    var users = message.parameters[3].split(' ');
    users.forEach(function (user) {
      this.bot.channels.getChannel(message.parameters[2]).users.addRawUser(user);
      var user = user.replace('+','').replace('@', '');
      var obj = {'command': 'WHOIS', 'parameters': [ user ] };
      this.bot.push(obj);
    }.bind(this));
  }.bind(this);
}