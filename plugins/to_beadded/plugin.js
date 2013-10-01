 /*
 * @CorePlugin
 * @Description: Handle load, unload and reload of other plugins.
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {load: 'load', unload: 'unload', reload: 'reload'};
  bot.pluginCore.apply(this, [bot]);

  this.unload = function unload (message) {
    this.bot.read('PRIVMSG', message.origin.channel, ':Unloading: '+message.message);
    this.bot.pluginHandler.pluginUnload(message.message);
  }.bind(this);

  this.load = function load (message) {
    if (this.bot.pluginHandler.pluginLoad(message.message+'.js'))
    {
      this.bot.read('PRIVMSG', message.origin.channel, ':Loading: '+message.message);
    }
    else
    {
      this.bot.read('PRIVMSG', message.origin.channel, ':Couldn\'t load: '+message.message+', it might already be loaded?');
    }
  }.bind(this);

  this.reload = function reload (message) {
    if (this.bot.config.admins[message.prefix.nick] === undefined || ! this.bot.config.admins[message.prefix.nick]['validated'])
    {
      console.log('User without admin rights can\'t reload' );
      return;
    }
    this.bot.read('PRIVMSG', message.parameters[0], ':Reloading: '+message.parameters[1].substr(''));
    this.bot.pluginHandler.pluginReload(message.message);
  }.bind(this);
}