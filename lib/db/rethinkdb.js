var r = require('rethinkdb')
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
DB.prototype.setup = function setup(callback) {
 onConnect(function (r, err, connection) {
    // assert.ok(err === null, err);
    r.dbCreate(config.db).run(connection, function(err, result) {
      if(err) {
        console.log("[DEBUG] RethinkDB database "+config.db+" already exists ("+err.name+":"+err.msg+")\n"+err.message);
      }
      else {
        console.log("[INFO ] RethinkDB database "+config.db+" created");
      }
      connection.close();
      callback();
    });
  });
}


// ### Create tables needed for the plugin
DB.prototype.createTable = function createTable(tableName, primaryKey) {
  onConnect(function (r, err, connection) {
    r.db(config.db).tableCreate(tableName, {primaryKey: primaryKey}).run(connection, function(err, result) {
      if(err) {
        console.log("[DEBUG] RethinkDB table "+tableName+" already exists ("+err.name+":"+err.msg+")\n"+err.message);
      }
      else {
        console.log("[INFO ] RethinkDB table "+tableName+" created");
      }
      connection.close();
    });
  });
}


// ### Add a single object to the database
DB.prototype.add = function add(table, obj, callback) {
  onConnect(function (r, err, connection) {
    r.db(config.db).table(table).insert(obj).run(connection, function(err, result) {
      if(err) {
        console.log("ERROR][%s] ("+err.name+":"+err.msg+")\n"+err.message);
      }
      callback(err, result);
      connection.close();
    });
  });
}


// ### Return all from table
DB.prototype.all = function all(table, callback) {
  onConnect(function (r, err, connection) {
    r.db(config.db).table(table).run(connection, function(err, result) {
      if(err) {
        console.log("ERROR][%s] ("+err.name+":"+err.msg+")\n"+err.message);
      }
      callback(err, result);
      connection.close();
    });
  });
}


// ### Where, rethink uses filter.
DB.prototype.where = function where(table, filter, callback) {
  onConnect(function (r, err, connection) {
    r.db(config.db).table(table).filter(filter).run(connection, function(err, cursor) {
      if(err) {
        console.log("ERROR][%s] ("+err.name+":"+err.msg+")\n"+err.message);
      }
      cursor.toArray(function(err, result) {
        callback(err, result);
        connection.close();
      });
    });
  });
}


// ### Query a the database directly
DB.prototype.query = function query(callback) {
  onConnect(function (r, err, connection) {
    callback(r, err, connection);
  });
}


function onConnect(done) {
  r.connect({host: config.host, port: config.port }, function(err, connection) {
    assert.ok(err === null, err);
    connection['_id'] = Math.floor(Math.random()*10001);
    done(r, err, connection);
  });
}