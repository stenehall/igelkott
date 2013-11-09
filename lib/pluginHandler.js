var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    PluginCore = require('../lib/plugin').Plugin;

var PluginHandler = exports.PluginHandler = function PluginHandler (igelkott) {
  this.igelkott = igelkott;

  this.possiblePluginPaths = [process.cwd()+'/plugins/', __dirname+'/../plugins/'];
  this.plugins = [];
};

/*
 * This DOES work
 */
PluginHandler.prototype.reload = function pluginReload (name) {
  this.unload(name);
  this.igelkott.load(name);
};


/*
 * Unload a single extra plugin.
 * Core plugins won't be allowed to unload
 */
PluginHandler.prototype.unload = function pluginUnload (file) {

  var path,
      expandedPath,
      exists;

  if (this.plugins[file])
  {
    if (this.possiblePluginPaths.some(function(testPath) {
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
  var reg = new RegExp(file);
  for (var i in require.cache)
  {
    if (reg.test(i))
    {
      this.plugins[file].Off();
      delete this.plugins[file];
      delete require.cache[i];
      return true;
    }
  }
  return false;
};

/*
 * Load a single core or extra plugin
 */
PluginHandler.prototype.tryToLoad = function tryToLoad (file) {

  // Plugin already loaded.
  if (this.plugins[file])
  {
    return false;
  }

  if (this.possiblePluginPaths.some(function(checkLoadPath) {
    return this._tryToLoad(file, checkLoadPath);
  }, this)) {
  }
  else {
    throw new Error("could not load core plugin: "+file);
  }
};

PluginHandler.prototype.load = function load(file, Plugin)
{
  var plugin = PluginCore.create(Plugin);

  this.plugins[file] = new plugin(this.igelkott);
  if ( ! this.igelkott.db && this.plugins[file].requireDB !== undefined && this.plugins[file].requireDB === true)
  {
    this.igelkott.log('Error: skiping load of '+file+' due to missing db connection');
    return false;
  }
  else
  {
    this.plugins[file].On();
    this.igelkott.log('Loading plugin: ' + file);
    return true;
  }
};


PluginHandler.prototype._tryToLoad = function _load(file, pluginPath)
{
  var p = path.resolve(pluginPath, file+'.js');
  if (fs.existsSync(p))
  {
    this.load(file, require(p).Plugin);
    return true;
  }
  return false;
};