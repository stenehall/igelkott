/*
 * @CorePlugin
 * @Description: Sets nick on connect
 *
 */

var Connect = function Connect() {
  this.listeners = {connect: this.connect};
};

Connect.prototype.connect = function connect ()
{
  this.igelkott.push({command: 'NICK', parameters: [this.igelkott.config.server.nick]});

  var obj = {
    'command': 'USER',
    'parameters': [ this.igelkott.config.server.nick, '0', '*', ':'+this.igelkott.config.server.nick ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
  };

  this.igelkott.push(obj);
};

exports.Plugin = Connect;