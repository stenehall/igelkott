/*
 * @CorePlugin
 * @Description: Sets nick on connect
 *
 * @Status: Very unstable
 */
var Connect = function Connect() {
  this.listeners = {connect: this.connect};
}

Connect.prototype.connect = function connect (message)
{
  this.push({command: "NICK", parameters: [this.config.server.nick]});

  var message = {
    'command': 'USER',
    'parameters': [ this.config.server.nick, '0', '*', ':'+this.config.server.nick ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
  };

  this.push(message);
}


exports.Plugin = Connect;