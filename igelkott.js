var Stream = require('stream'),
Erk = require('erk'),
Fs = require('fs'),
Net = require('net'),
Path = require('path'),
_ = require('underscore'),
Colors = require('colors'),
Parse = require('parse').Parse,

Queue = require('./lib/queue').Queue,
PluginHandler = require('./lib/pluginHandler.js').PluginHandler;

var Igelkott = module.exports = function Igelkott(config) {

  Stream.Duplex.call(this, {
    objectMode: true
  });

  if ( ! config.plugins) throw new Error("config.plugins is not defined, igelkott is pointless without any plugins");
  this.config = config;

  this.parser = new Erk.Parser();
  this.composer = new Erk.Composer();
  this.queue = new Queue(this);
  this.plugin = new PluginHandler(this);

  this._read = function _read(size) {};

  this._write = function _write(message, enc, callback) {
    this.emit(message.command, message);
    this.queue.handleQueue(message);
    callback();
  };

  //this.config.core.forEach(function(key) {
  //  this.config.plugins[key] = null;
  //}.bind(this));

  // Time to load some plugins.
  for (var plugin in this.config.plugins) {
    this.load(plugin, this.config.plugins[plugin]);
  }

  this.setUpServer(this.config.adapter || new Net.Socket());
  this.doConnect(this.config.connect || function() {
    this.server.connect(this.config.server.port, this.config.server.host);
  });

};

Igelkott.prototype = Object.create(Stream.Duplex.prototype, {
  constructor: {
    value: Igelkott
  }
});

Object.defineProperty(Igelkott.prototype, "db", {
  get: function() {
    if (this._db === undefined) {
      if (this.config.database === undefined ||
        this.config.database.app_id === undefined ||
        this.config.database.app_id === '' ||
        this.config.database.js_key === undefined ||
        this.config.database.js_key === '') {
        this._db = false;
    } else {
      Parse.initialize(this.config.database.app_id, this.config.database.js_key);
      this._db = Parse;
    }
  }
  return this._db;
}
});

Igelkott.prototype.load = function load(pluginName, config, plugin) {

  var config = config || this.config.plugins[pluginName];
  var plugin = plugin || require('../igelkott-'+pluginName).Plugin;

  try {
    this.plugin.load(pluginName, config, plugin);
  } catch (err)
  {
    console.log(err);
    this.log('No such plugin: '+pluginName);
  }
};

Igelkott.prototype.setUpServer = function setUpServer(server) {
  this.server = server;

  this.server.on('connect', function() {
    this.pipe(this.composer).pipe(this.server).pipe(this.parser).pipe(this);
    this.emit('connect');
  }.bind(this));
};

Igelkott.prototype.doConnect = function doConnect(doConnect) {
  this.connection = doConnect;
};

Igelkott.prototype.log = function log() {};

Igelkott.prototype.connect = function connect() {
  this.connection();
};

Igelkott.prototype.end = function connect() {
  this.log('Time to sleep...');
};
