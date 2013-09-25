var Fs = require('fs')
  , Path = require('path')
  ;

var PluginHandler = exports.PluginHandler = function PluginHandler (bot) {
  this.bot = bot;

  this.core = Path.resolve(__dirname, '../plugins');
  this.extra = Path.resolve(Path.dirname(require.main.filename), 'plugins');

  this.plugins = {'core': [], 'extra': []};

  // lets load all plugins, without core this really doesn't do much
  this.loadPlugins(this.core, 'core');

  //this.loadPlugins(this.extra, 'extra');
}

/*
 * We'll load all files in plugins/ except . files.
 */
PluginHandler.prototype.loadPlugins  = function loadPlugins (basePath, type) {

  var self = this;

  Fs.readdir(basePath, function (err, files) {

    if (err) {
      console.log(err);
      return false;
    }

    files.forEach(function (file) {
      // Skip hidden files
      if(file[0] === '.') return;

      try {
        self.pluginLoad(file, basePath, type);
      } catch(err) {
        console.log(err);
        return false;
      }
    });
  });
}


/*
 * For some reason this isn't working...
 * It results in having the plugin loaded multiple times.
 * The removeListener is broke?
 */
PluginHandler.prototype.pluginReload = function pluginReload (file) {
  this.pluginUnload(file);
  this.pluginLoad(file);
}

/*
 * Unload a single extra plugin.
 * Core plugins won't be allowed to unload
 */
PluginHandler.prototype.pluginUnload = function pluginUnload (file) {

  // We don't allow you to unload core plugins.
  var folder = this.extra
    , type = 'extra'
    , expandedPath;

  // Make sure we always have .js
  if (file.indexOf('.js') === -1)
  {
    file += '.js';
  }

  if (this.plugins[type][file])
  {
    this.plugins[type][file].Off();
    delete this.plugins[type][file];

    expandedPath = require.resolve(folder+'/'+file);
    if (expandedPath)
    {
      delete require.cache[expandedPath];
    }
  }
}

/*
 * Load a single core or extra plugin
 */
PluginHandler.prototype.pluginLoad = function pluginLoad (file, folder, type) {

  var path
    , exists;

  // Default to extra if not provided by Bot.
  if(folder === undefined) {
    folder = this.extra;
  }

  if(type === undefined) {
    type = 'extra';
  }

  // Make sure we always have .js
  if (file.indexOf('.js') === -1)
  {
    file += '.js';
  }

  // Plugin already loaded.
  if (this.plugins[type][file])
  {
    return false;
  }

  path = folder+'/'+file;
  exists = Fs.existsSync(path);

  if (exists)
  {
    Plugin = require(path).Plugin;
    this.plugins[type][file] = new Plugin(this.bot);
    this.plugins[type][file].On();
    return true;
  }
  else
  {
    return false;
  }


}
