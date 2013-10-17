var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    PluginCore = require('../lib/plugin').Plugin;

var PluginHandler = exports.PluginHandler = function PluginHandler (igelkott) {
  this.igelkott = igelkott;

  this.possiblePluginPaths = [process.cwd()+'/plugins/', __dirname+'/../plugins/'];
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
    var possiblePluginPaths = this.possiblePluginPaths.concat(path.resolve(process.cwd(), 'node_modules/igelkott-'+file));


    if (possiblePluginPaths.some(function(testPath) {
      return this._unload(testPath, file);
    }, this))
    {
      // @TODO: Add unloaded plugin info
    }
    else
    {
      // @TODO: Add error
    }
  }
};

PluginHandler.prototype._unload = function _unload(pluginPath, file)
{
  if (fs.existsSync(pluginPath+file))
  {
    this.plugins[file].Off();
    delete this.plugins[file];

    var p = require.resolve(pluginPath+file);
    if (p)
    {
      delete require.cache[p];
      return true;
    }
  }
  return false;
}

/*
 * Load a single core or extra plugin
 */
PluginHandler.prototype.load = function load (file) {

  // Check for the plugin in npm as well.
  var possiblePluginPaths = this.possiblePluginPaths.concat(path.resolve(process.cwd(), 'node_modules/igelkott-'+file));

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

  if (possiblePluginPaths.some(function(checkLoadPath) {
    return this._load(checkLoadPath, file);
  }, this)) {
    // @TODO: Add loaded plugin info
  }
  else {
    // @TODO: Add error message
  }

};


PluginHandler.prototype._load = function _load(pluginPath, file)
{
  var plugin, Plugin;
  var p = path.resolve(pluginPath, file);
  if (fs.existsSync(p))
  {
    Plugin = require(p).Plugin;
    plugin = PluginCore.create(Plugin);

    this.plugins[file] = new plugin(this.igelkott);
    if (this.plugins[file].db === undefined && this.plugins[file].requireDB !== undefined && this.plugins[file].requireDB === true)
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
  return false;
};