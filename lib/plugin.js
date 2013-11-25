var _ = require('underscore');

// Simple plugin constructor
var Plugin = exports.Plugin = function Plugin(igelkott, config) {
  this.igelkott = igelkott;
  this.config = config;
};


/*
 * Adds listeners for the plugin.
 */
 Plugin.prototype.On = function On (callback) {
  var key;

  for (key in this.listeners)
  {
    this.igelkott.addListener(key, this.listeners[key].bind(this));
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
    this.igelkott.removeListener(key, this.listeners[key]);
    delete this.igelkott._events[key];
  }
  if(callback !== undefined)
  {
    callback();
  }
};

// factory function
Plugin.create = function create(builder, config) {
  var p = function(igelkott, config) {
    Plugin.call(this, igelkott, config);
    builder.call(this, igelkott);
  };

  p.prototype = Object.create(Plugin.prototype, {constructor: {value: builder.name}});
  _.extend(p.prototype, builder.prototype);
  p.name = builder.name;

  return p;
};