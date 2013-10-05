/*
 * @CorePlugin
 * @Description: Makes sure the bot isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */

var Plugin = function Plugin() {
  this.name = "plugin";
  this.help = {
    "default": "At the moment it only supports reload of plugins, it'll soon support load and unload as well",
    "reload": {
      "default": "!reload <plugin>"
    }
  };

  this.listeners = {'trigger:reload': this.reload};
};

Plugin.prototype.reload = function reload(message) {
  this.plugin.reload(message.parameters[1].split(' ')[1]);
};

exports.Plugin = Plugin;