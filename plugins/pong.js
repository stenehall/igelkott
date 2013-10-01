/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */
var Pong = function Pong() {
  this.pluginName = "pong";

  this.listeners = {'PRIVMSG': this.pong};

  // Add a 330 rule
  this.bot.queue.addCommand('330', function(command, message) {
    return (command.message.prefix.nick === message.parameters[2]);
  });

}

Pong.prototype.pong = function pong(message) {
  var obj = JSON.parse(JSON.stringify(message));
  obj.parameters = [message.parameters[0], 'Yeah it does', message.parameters[1]];
  this.queue.add({command:'330', message: obj});
  this.push({command:'WHOIS', parameters: [message.prefix.nick]});
}

exports.Plugin = Pong;