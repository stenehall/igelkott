var _ = require('underscore');
var Parse = require('parse').Parse;

// Simple plugin constructor
var Plugin = exports.Plugin = function Plugin(bot) {
  this.bot = bot;
};

Object.defineProperty(Plugin.prototype, "db", {
get: function() {
 if (!this._db) {
  Parse.initialize("7plkWRQ7ogS47BSlLyMqoragTaKeyQ78IaQuTXq1", "FqZslvsIKtHh0VoFR0LSGU8w4muu6dz3naMZXoJ6");
   this._db = Parse;
 }
 return this._db;
}});


/*
 * Adds listeners for the plugin.
 */
Plugin.prototype.On = function On (callback) {
  var key;

  for (key in this.listeners)
  {
    this.bot.addListener(key, this.listeners[key].bind(this));
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
    builder.call(this, bot);
  };

  p.prototype = Object.create(Plugin.prototype, {constructor: {value: builder.name }});
  _.extend(p.prototype, builder.prototype);

  p.name = builder.name;

  return p;
};