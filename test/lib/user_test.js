// Chai way
var assert = require('chai').assert;

describe("User handling", function(){

  var User, users;

  beforeEach(function() {
    User = require('../../lib/user').Users;
    users = new User();
  });

  it("#getUser('test')      - Finding user, should return false", function(done) {
    var result = users.getUser('test');

    assert.equal(result, false);
    done();
  });

  it("#addUser('test')      - Adding user test", function(done) {
    var result = users.addUser('test');

    assert.typeOf(result, 'object');
    done();
  });

  it("#getUser('test')      - Finding user", function(done) {
    users.addUser('test');
    var result = users.getUser('test');
    assert.typeOf(result, 'object');
    done();
  });

  it("#removeUser('test')  - Remove user", function(done) {
    users.addUser('test');
    var result = users.removeUser('test');

    assert.equal(result, true);
    done();
  });

  it("#removeUser('test')   - Remove user", function(done) {
    var result = users.removeUser('test');

    assert.equal(result, false);
    done();
  });
});
