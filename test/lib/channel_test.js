var assert = require('chai').assert;

describe('Channel', function(){

  var Channel = require('../../lib/channel').Channel
  , Users = require('../../lib/user').Users;

  var channels;

  beforeEach(function() {
    channels = new Channel();
  });

  it("#getChannel('test')      - Finding channel, should return false", function(done) {
    var result = channels.getChannel('test');
    assert.equal(result, false);
    done();
  });

  it("#addChannel('test')      - Add channel", function(done) {
    var result = channels.addChannel('test');
    assert.typeOf(result, 'object');
    done();
  });

  it("#getChannel('test')      - Get channel", function(done) {
    channels.addChannel('test');
    var result = channels.getChannel('test');
    assert.typeOf(result, 'object');
    done();
  });

  it("#removeChannel('test')      - Remove channel", function(done) {
    var result = channels.removeChannel('test');
    assert.equal(result, false);
    done();
  });

  it("#removeChannel('test')      - Remove channel", function(done) {
    channels.addChannel('test');
    var result = channels.removeChannel('test');
    assert.equal(result, true);
    done();
  });

})