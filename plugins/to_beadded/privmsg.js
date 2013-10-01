  /*
 * @CorePlugin
 * @Description: Handles PRIVMSG
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {PRIVMSG: 'privmsg', '330': '_330'};
  bot.pluginCore.apply(this, [bot]);

  this.queue = [];
  var that = this;

  this.privmsg = function privmsg (message) {

    var filter = new RegExp('^'+this.bot.config.trigger+'([^ ]*)');
    trigger = message.parameters[1].match(filter);
    if (trigger)
    {
      this.bot.emit(trigger[1], message);
    }

    console.log(message);

    if (message.prefix.nick === 'eighty4')
    {
      var queue_obj = {command: 'PRIVMSG', parameters: [message.parameters[0], 'Yeah it does!' + message.parameters[1]]};
      this.queue.push(queue_obj);

      var user = message.prefix.nick.replace('+','').replace('@', '');
      var obj = {'command': 'WHOIS', 'parameters': [ user ] };
      this.bot.push(obj);

    }
  }.bind(this);

  this._330 = function _330 (message) {
    if (message.parameters[3] === 'is logged in as')
    {
      if(this.queue.length > 0)
      {
        var queue_obj = this.queue.shift();
        console.log(queue_obj);
        this.bot.push(queue_obj);
      }
    }
  }.bind(this);
}