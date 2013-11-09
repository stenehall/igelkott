/*
 * @CorePlugin
 * @Description: Listens on 001 after that it should be safe to join
 *
 */

var _001 = function _001() {
  this.listeners = {'001': this._001};
};

_001.prototype._001 = function _001() {
  this.igelkott.config.server.channels.forEach(function (channel) {
    var obj = {'command': 'JOIN', 'parameters': [ channel ]};
    this.igelkott.push(obj);
  }, this);
};

exports.Plugin = _001;