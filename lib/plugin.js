var _ = require('underscore');

// Simple plugin constructor
var Plugin = exports.Plugin = function Plugin(bot) {
  this.bot = bot;
};

/*
 * Adds listeners for the plugin.
 */
Plugin.prototype.On = function On (callback) {
  var key;
  for (key in this.listeners)
  {
    this.bot.addListener(key, this.listeners[key]);
  }

  if (callback !== undefined)
  {
    callback();
  }
};

/*
 * Removes all listeners added by On
 */
Plugin.prototype.Off = function Off (callback) {
  var key;
  for (key in this.listeners)
  {
    this.bot.removeListener(key, this.listeners[key]);
    delete this.bot._events[key];
  }
  if(callback !== undefined)
  {
    callback();
  }
};

// factory function
Plugin.create = function create(builder) {
  var p = function(bot) {
    Plugin.call(this, bot);
    builder.call(this);
  };

  p.prototype = Object.create(Plugin.prototype, {constructor: {value: builder.name }});
  _.extend(p.prototype, builder.prototype);

  p.name = builder.name;

  return p;
};