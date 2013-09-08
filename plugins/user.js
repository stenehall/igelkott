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
    if ( ! this.bot.channels.getChannel(message.message))
    {
      this.bot.channels.addChannel(message.params[0]);
    }

    // @TODO: This should be fixed for real instead
    var user = message.origin.user.nick.replace(':','');
    this.bot.channels.getChannel(message.params[0]).users.addUser(user);
  }.bind(this);

  // Mark a user as offline when parting the channel
  // This needs to be rewritten later to actually work as it should.
  this.part = function part (message) {
    if (this.bot.channels.getChannel(message.origin.channel))
    {
      var user = this.bot.channels.getChannel(message.origin.channel).users.getUser(message.origin.user.nick);
      user.isOnline = false;
      //this.bot.read('PRIVMSG', message.origin.channel, ':PART: '+message.origin.user.nick);
    }
  }.bind(this);
}