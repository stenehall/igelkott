/*
 * @CorePlugin
 * @Description: Makes sure the igelkott isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */
var Pong = function Pong() {
  this.pluginName = 'pong';

  this.listeners = {'PRIVMSG': this.pong};
};

Pong.prototype.pong = function pong(message) {
  var obj = JSON.parse(JSON.stringify(message));
  obj.parameters = [message.parameters[0], 'Yeah it does', message.parameters[1]];
  this.queue.add({command:'330', message: obj});
  this.igelkott.push({trigger: function(command, message) {
    return (message.command === '330' && command.message.prefix.nick === message.parameters[2]);
  }, parameters: [message.prefix.nick]});
};

exports.Plugin = Pong;