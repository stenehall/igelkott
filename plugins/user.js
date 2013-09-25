/*
 * @CorePlugin
 * @Description: Keeps track of users, by listening to JOIN and PART
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {JOIN: 'join', PART: 'part'};
  bot.pluginCore.apply(this, [bot]);

  this.join = function join (message) {
    var channel = message.parameters[0];
    var nick = message.prefix.nick

    if ( ! this.bot.channels.getChannel(channel))
    {
      this.bot.channels.addChannel(channel);
    }
    this.bot.channels.getChannel(channel).users.addUser(nick);
  }.bind(this);

  // Mark a user as offline when parting the channel
  // This needs to be rewritten later to actually work as it should.
  this.part = function part (message) {
    var channel = message.parameters[0];
    var nick = message.prefix.nick

    if (this.bot.channels.getChannel(channel))
    {
      var user = this.bot.channels.getChannel(channel).users.getUser(nick);
      user.isOnline = false;
    }
  }.bind(this);
}