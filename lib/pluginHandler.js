var PluginCore = require('../lib/plugin').Plugin;

var PluginHandler = exports.PluginHandler = function PluginHandler (igelkott) {
  this.igelkott = igelkott;
  this.plugins = [];
  this.listeners = [];
};

/*
 * Unload a single extra plugin.
 * Core plugins won't be allowed to unload
 */
 PluginHandler.prototype.unload = function unload (file) {
  if (this.plugins[file])
  {
    if(this._unload(this.igelkott.config.pluginPath, file))
    {
      // @TODO: Add unloaded plugin info
      this.igelkott.log('Unloaded plugin: '+file);
    }
    else
    {
      this.igelkott.error('Failed unloading plugin: '+file);

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
  this.plugins[file].internalName = file;

  this.plugins[file].On();

  if (this.plugins[file].require)
  {
    this.plugins[file].require.forEach(function(requiredPlugin) {
      if ( ! this.plugins[requiredPlugin]) {
        this.unload(file);
        this.igelkott.error('Skiping load of '+file+' due to missing dependency: '+requiredPlugin);
        return false;
      }
    }.bind(this));

  }

  this.igelkott.log('Loading plugin: ' + file);
  return this.plugins[file];
};
