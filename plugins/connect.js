/*
 * @CorePlugin
 * @Description: Sets nick on connect
 *
 * @Status: Very unstable
 */
var Connect = function Connect() {
  this.listeners = {connect: this.connect};
};

Connect.prototype.connect = function connect ()
{
  this.bot.push({command: 'NICK', parameters: [this.bot.config.server.nick]});

  var obj = {
    'command': 'USER',
    'parameters': [ this.bot.config.server.nick, '0', '*', ':'+this.bot.config.server.nick ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
  };

  this.bot.push(obj);
};

exports.Plugin = Connect;