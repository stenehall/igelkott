var _ = require('underscore');

// Simple plugin constructor
var Plugin = function Plugin(bot) {
  this.bot = bot;
};

// shared functions
Plugin.prototype.foobar = function foobar(event, listener) {
  console.log('Plugin - Prototype - '+this.bot);
};

// factory function
Plugin.create = function create(builder) {
  var p = function(bot) {
    Plugin.call(this, bot);
    builder.call(this);
  };

   p.prototype = Object.create(Plugin.prototype, {constructor: {value: builder.name }});
 _.extend(p.prototype, builder.prototype);


  p.name = builder.name;

  return p;
};

// -----------------------------------------------------------------------------

var Ping = Plugin.create(function Ping() {});
Ping.prototype.foobar2 = function foobar2() {
  console.log("Ping - Prototype");
};

console.log('----------------------------');

var pingInstance = new Ping('atti');
pingInstance.foobar();
pingInstance.foobar2();

// -----------------------------------------------------------------------------

console.log('----------------------------');

var _Ping2 = function _Ping2() {

  this.foobar2 = function() {
    console.log('Ping2 - inner function');
  }
}

_Ping2.prototype.foobar3 = function foobar2() {
  console.log("_Ping2 - prototype");
};

var Ping2 = Plugin.create(_Ping2);
var pingInstance = new Ping2('atti');
pingInstance.foobar();
pingInstance.foobar2();
try {
  pingInstance.foobar3(); // This will not work
} catch(e) {}

// -----------------------------------------------------------------------------

console.log('----------------------------');

var _Ping3 = function _Ping3() {

  console.log(this.bot);

  this.bot = 'itta';

  this.foobar2 = function() {
    console.log('Ping3 - inner function - '+this.bot);
  }
}

_Ping3.prototype.foobar4 = function foobar4() {
  console.log('Ping3 - Prototype extended - '+this.bot);
}

var Ping3 = Plugin.create(_Ping3);


var pingInstance = new Ping3('atti');
pingInstance.foobar();
pingInstance.foobar2();
pingInstance.foobar4();
