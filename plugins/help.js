/*
 * @CorePlugin
 * @Description: Makes sure the igelkott isn't disconnected by sending PONG
 *
 * @Status: Very unstable
 */

var Help = function Help() {
  this.name = 'help';
  this.help = {
    "default": "This is the help plugin, you just called it so you already know how it works"
  };

  this.listeners = {'trigger:help': this.trigger};
};

Help.prototype.trigger = function trigger(message) {

  var args = message.parameters[1].split(' ');

  args.shift(); // Remove !help

  var path = args.join('->');

  if (args.length === 0) {

    var names = [];

    for (var key in this.igelkott.plugin.plugins)
    {
      if (this.igelkott.plugin.plugins[key].name !== undefined)
      {
        names.push(this.igelkott.plugin.plugins[key].name);
      }
    }

    message.parameters[1] = 'You have the following plugins to play with: '+names.join(', ');
  } else {
    var name = args.shift();

  // Make sure we always have .js
    if (name.indexOf('.js') === -1) {
      name += '.js';
    }

    if (this.igelkott.plugin.plugins[name] !== undefined) {
      var helpText = this.igelkott.plugin.plugins[name].help;

      if (args.length > 0) {
        // Iterate over help to find the correct help based on args
        args.forEach(function(arg) {
          if (helpText[arg] !== undefined) {
            helpText = helpText[arg];
          } else {
            helpText = undefined;
          }
        }.bind(this));
      }

      if(helpText !== undefined && helpText.default !== undefined) {
        message.parameters[1] = 'Help for '+path+': '+helpText.default;
      } else {
        message.parameters[1] = 'No help for '+path;
      }
    } else {
      message.parameters[1] = 'No plugin named '+name;
    }
  }

  this.igelkott.push(message);
};

exports.Plugin = Help;