var Stream = require('stream'),
    Erk = require('erk'),
    Fs = require('fs'),
    Net = require('net'),
    Path = require('path'),
    _ = require('underscore'),

    Queue = require('./lib/queue').Queue,
    PluginHandler = require('./lib/pluginHandler.js').PluginHandler;

var Igelkott = module.exports = function Igelkott (config) {

  Stream.Duplex.call(this, {objectMode: true});

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

  this.loadConfig(config);

  // Time to load some plugins.
  if (this.config.plugins !== undefined && this.config.plugins.length > 0)
  {
    this.config.plugins.forEach(function(plugin) {
      this.plugin.load(plugin);
    }.bind(this));
  }

  this.setUpServer(this.config.adapter || new Net.Socket());
  this.doConnect(this.config.connect || function() {this.server.connect(this.config.server.port, this.config.server.host); });

};
Igelkott.prototype = Object.create(Stream.Duplex.prototype, {constructor: {value: Igelkott}});

Igelkott.prototype.setUpServer = function setUpServer(server) {
  this.server = server;

  this.server.on('connect', function () {
    this.pipe(this.composer).pipe(this.server).pipe(this.parser).pipe(this);
    this.emit('connect');
  }.bind(this));
};

Igelkott.prototype.doConnect = function doConnect(doConnect) {
  this.connection = doConnect;
};

Igelkott.prototype.connect = function connect() {
  this.connection();
};

Igelkott.prototype.end = function connect () {
  console.log('Time to sleep...');
};

Igelkott.prototype.loadConfig = function loadConfig(config) {

  var configFile = Path.resolve(process.cwd(), 'config.json');

  if ( ! Fs.existsSync(configFile))
  {
    console.error('Please copy the config.json file from the npm package to this directory and edit it as you like.');
    return false;
  }

  // Make sure we actually load the config from file and not from cache.
  delete require.cache[require.resolve(configFile)];
  this.config = require(configFile);

  // @TODO: Rewrite this into using ENV instead. This really isn't useful.
  if (config !== undefined)
  {
    _.extend(this.config, config);
  }
};