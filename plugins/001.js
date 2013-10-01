/*
 * @CorePlugin
 * @Description: Listens on 001 after that it should be safe to join
 *
 * @Status: Very unstable
 */

var Ping = function Ping(bot) {
  this.pluginName = "ping";

  this.listeners = {'001': this._001};

}

Ping.prototype._001 = function _001(message) {

  console.log(message);

    this.config.channels.forEach(function (channel) {
      var message = {'command': 'JOIN', 'parameters': [ channel ]};
      console.log(message);
      this.push(message);
    }, this);
}

exports.Plugin = Ping;