/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */

var Ping = function Ping() {
  this.listeners = {PING: this.pong};

  this.name = "Ping";

  this.help = {
    "default": "This is some help text",
    "foobar": {
      "default": "A Foobar text"
    },
    "barfoo": {
      "default": "A Barfoo text",
      "foobar": {
        "default":"Hello!!!"
      }
    }
  }
};

Ping.prototype.pong = function pong(message) {
  var obj = { 'command': 'PONG', 'parameters': [ message.parameters[0] ] };
  this.push(obj);
};

exports.Plugin = Ping;