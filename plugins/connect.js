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
  var nick = {
    command: 'NICK',
    parameters: [this.igelkott.config.server.nick]
  };

  if (this.igelkott.config.server.password !== undefined)
  {
    var pass = {
      command: 'PASS',
      parameters: [this.igelkott.config.server.password]
    };
    this.igelkott.push(pass);
  }

  var user = {
    'command': 'USER',
    'parameters': [ this.igelkott.config.server.nick, '0', '*', ':'+this.igelkott.config.server.nick ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
  };

  this.igelkott.push(nick);
  this.igelkott.push(user);
};

exports.Plugin = Connect;