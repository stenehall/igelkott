exports.Users = function Users () {

  var users = [];

  this.addUser = function addUser (nick) {

    if (users[nick] !== undefined)
    {
      return users[nick];
    }

    var userObject = {isOp: false, isVoice: false, isSignedIn: false, isAdmin: false, isOnline: true};
    users[nick] = userObject;
    return users[nick];
  }

  this.addRawUser = function addRawUser (raw) {

    console.log(raw);
    var key = raw.replace('+','').replace('@', '');
    console.log(key);

    var userObject = {isOp: false, isVoice: false, isSignedIn: false, isAdmin: false, isOnline: true};

    console.log(userObject);

    if (users[key] != undefined)
    {
      userObject = users[key];
    }

    // We have an op!
    if (raw.match(/@/))
    {
      userObject.isOp = true;
    }

    // We have a voice, let's be heard!
    if (raw.match(/\+/))
    {
      userObject.isVoice = true;
    }

    users[key] = userObject;
    console.log(users);
    return users[key];
  }

  this.getUser = function getUser (nickname) {

    console.log(users);
    if (users[nickname] !== undefined)
    {
      return users[nickname];
    }
    return false;
  }

  this.getUsers = function getUsers () {
    return users;
  }

  this.removeUser = function removeUser (nickname) {
    if (users[nickname] !== undefined)
    {
      delete users[nickname];
      return true;
    }
    else
    {
      return false;
    }
  }

}