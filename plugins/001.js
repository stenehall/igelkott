/*
 * @CorePlugin
 * @Description: Listens on 001 after that it should be safe to join
 *
 * @Status: Very unstable
 */

var Ping = function Ping() {
  this.listeners = {'001': this._001};
  this.requireDB = true;
};

Ping.prototype._001 = function _001() {
  this.bot.config.server.channels.forEach(function (channel) {
    var obj = {'command': 'JOIN', 'parameters': [ channel ]};
    this.bot.push(obj);
  }, this);
};

exports.Plugin = Ping;