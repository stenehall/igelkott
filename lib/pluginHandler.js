var Fs = require('fs'),
    Path = require('path'),
    PluginCore = require('../lib/plugin').Plugin;

var PluginHandler = exports.PluginHandler = function PluginHandler (bot) {
  this.bot = bot;

  this.plugins = [];
}

/*
 * For some reason this isn't working...
 * It results in having the plugin loaded multiple times.
 * The removeListener is broke?
 */
PluginHandler.prototype.reload = function pluginReload (name) {
  this.unload(name);
  this.load(name);
};

/*
 * Unload a single extra plugin.
 * Core plugins won't be allowed to unload
 */
PluginHandler.prototype.unload = function pluginUnload (file) {

  var path,
      expandedPath,
      exists;

  // Make sure we always have .js
  if (file.indexOf('.js') === -1)
  {
    file += '.js';
  }

  if (this.plugins[file])
  {
    this.plugins[file].Off();
    delete this.plugins[file];

    path = process.cwd()+'/plugins/'+file;
    exists = Fs.existsSync(path);

    if ( ! exists) // Ok, one more try
    {
      path = __dirname+'/../plugins/'+file;
      exists = Fs.existsSync(path);
    }
    if (exists)
    {
      expandedPath = require.resolve(path);
      if (expandedPath)
      {
        delete require.cache[expandedPath];
      }
    }
  }
};

/*
 * Load a single core or extra plugin
 */
PluginHandler.prototype.load = function load (file) {

  var path,
      exists;

  // Make sure we always have .js
  if (file.indexOf('.js') === -1)
  {
    file += '.js';
  }

  // Plugin already loaded.
  if (this.plugins[file])
  {
    return false;
  }

  path = process.cwd()+'/plugins/'+file;
  exists = Fs.existsSync(path);

  if ( ! exists) // Ok, one more try
  {
    path = __dirname+'/../plugins/'+file;
    exists = Fs.existsSync(path);
  }

  var plugin, Plugin;

  if (exists)
  {
    Plugin = require(path).Plugin;
    plugin = PluginCore.create(Plugin);

    this.plugins[file] = new plugin(this.bot);
    if (this.db === undefined && this.plugins[file].dbConfig !== undefined)
    {
      var log = 'Error     - Skiping load of '+file+' due to missing db connection';
      console.log(log.red);
      return false;
    }
    else
    {
      this.plugins[file].On();
      return true;
    }
  }
  else
  {
    return false;
  }
};
