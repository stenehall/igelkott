/*
 * @CorePlugin
 * @Description: Listens to 300 and 311 to keep track of user identify
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {'330': '_330'}; //, '311': '_311'};
  bot.pluginCore.apply(this, [bot]);

  /*
   * Tries to find the user in all channels and gives it isSignedIn.
   * If the users is admin this is also the time to give it admin
   */
  this._330 = function echo (message) {

    if (message.parameters[3] === 'is logged in as')
    {
      if (this.bot.config.admins[message.parameters[1]] != undefined)
      {
        this.bot.config.admins[message.parameters[1]]['validated'] = true;
      }

      // I have no idea what I've done here :)
      // To tired to figure it out now.
      // forEach really should work here... stupid.
      for (var channelKey in this.bot.channels.getChannels())
      {
        channel = this.bot.channels.getChannel(channelKey);
        user = channel.users.addUser(message.parameters[1]);
        user.isSignedIn = true;
        if (this.bot.config.admins[message.parameters[1]] !== undefined)
        {
          user.isAdmin = true;
        }
      }
    }
  }.bind(this);

  /*
   * Tries to find the user in all channels and gives it isSignedIn.
   * If the users is admin this is also the time to give it admin
   */
  // this._311 = function echo (message) {

  //   console.log(message);
  //   var matches = /([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*)/.exec(message.message);

  //   if (matches != null)
  //   {
  //     nick = matches[2];
  //     // forEach really should work here... stupid.
  //     for (var channelKey in this.bot.channels.getChannels())
  //     {
  //       channel = this.bot.channels.getChannel(channelKey);
  //       user = channel.users.addUser(nick);
  //       user.raw = message.message;
  //     }
  //   }
  // }.bind(this);
}