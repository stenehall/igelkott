  /*
 * @CorePlugin
 * @Description: Handles PRIVMSG
 *
 * @Status: Very unstable
 */
var PRIVMSG = function PRIVMSG() {
  this.listeners = {PRIVMSG: this.msg};
};

PRIVMSG.prototype.msg = function msg(message) {
    var filter = new RegExp('^'+this.config.trigger+'([^ ]*)');
    var trigger = message.parameters[1].match(filter);

    if (trigger)
    {
      this.emit('trigger:'+trigger[1], message);
    }
};

exports.Plugin = PRIVMSG;