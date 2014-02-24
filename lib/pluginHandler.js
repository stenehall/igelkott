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


PluginHandler.prototype.load = function load(file, pluginConfig, Plugin)
{
  var config = pluginConfig || {};
  var plugin = PluginCore.create(Plugin);

  this.plugins[file] = new plugin(this.igelkott, config);

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
