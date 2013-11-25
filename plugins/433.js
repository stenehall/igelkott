/*
 * @CorePlugin
 * @Description: Listens on 433 (and 451) after that it should be safe to join
 *
 */

 var plugin_433 = function plugin_433() {
  this.listeners = {'433': this._433, '451': this._433};
};

plugin_433.prototype._433 = function _433() {
  this.igelkott.config.server.nick = this.igelkott.config.server.nick+'_';
  this.igelkott.emit('connect');
};

exports.Plugin = plugin_433;