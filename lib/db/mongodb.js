var mongo = require('mongodb')
  , Server = mongo.Server
  , mongo_db = mongo.Db
  , assert = require('assert')


var config = {};
var bot;

var DB = exports.DB = function DB (app) {
  bot = app;
  config.host = process.env.RDB_HOST || bot.config.db.host;
  config.port = parseInt(process.env.RDB_PORT) || bot.config.db.port;
  config.db = process.env.RDB_DB || bot.config.db.db
}


// ### Make sure we have a database
DB.prototype.setup = function setup() {
  this.db= new mongo_db(config.db, new Server(config.host, config.port, {safe: false}, {auto_reconnect: true}));
  this.db.open(function(err, db){
    if (err)
    {
      console.error("Couldn't connect to database");
    }
    else
    {
      console.error("We are connected");
    }
  });
}


// ### Create tables needed for the plugin
DB.prototype.createTable = function createTable(tableName, primaryKey) {
  this.db.createCollection(tableName, function(err, collection) {
    if(err) {
      console.error("[DEBUG] RethinkDB table "+tableName+" already exists ("+err.name+":"+err.msg+")\n"+err.message);
    }
    else {
      console.error("[INFO ] Mongodb collection "+tableName+" created");
    }
  });
}


DB.prototype.getCollection= function getCollection(table, callback) {
  this.db.collection(table, function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

DB.prototype.all = function all(table, callback) {
  this.getCollection(table, function(err, collection) {
    if( err ) callback(err)
    else {
      collection.find().toArray(function(err, result) {
        if( err ) console.log("ERROR] ("+err.name+":"+err.msg+")\n"+err.message);
        else callback(err, result)
      });
    }
  });
};


DB.prototype.add = function add(table, obj, callback) {
 this.getCollection(table, function(err, collection) {
    if( err ) console.log("ERROR] ("+err.name+":"+err.msg+")\n"+err.message);
    else {
       collection.insert(obj, function() {
        callback(null, obj);
      });
    }
  });
};

//find all employees
DB.prototype.where = function where(table, filter, callback) {
    this.getCollection(table, function(err, collection) {
      if(err) {
        console.log("ERROR]"+err);
      }
      else
      {
        collection.find(filter).toArray(function(err, result) {
          if( err ) {
            console.log(err);
          }
          else
          {
            callback(null, result)
          }
        });
      }
    });
};