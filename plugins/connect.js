/*
 * @CorePlugin
 * @Description: Joins channels and sets nick on connect, should probably be in
 * bot.js
 *
 * @Status: Very unstable
 */
var Connect = function Connect() {
  this.listeners = {connect: this.connect};
}

Connect.prototype.connect = function connect (message)
{
  this.push({command: "NICK", parameters: ["atti"]});

  var message = {
    'command': 'USER',
    'parameters': [ 'atti', '0', '*', ':atti' ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
  };

  this.push(message);
}


exports.Plugin = Connect;