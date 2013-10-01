var Queue = exports.Queue = function Queue(bot) {

  this.bot = bot;

  var queue = {};
  var commands = {};

  this.addCommand = function addCommand(command, callback) {
    commands[command] = callback;
  };

  this.getCommand = function getCommand(command) {
    return commands[command];
  }

  this.add = function add(obj) {
    if(queue[obj.command] === undefined)
    {
      queue[obj.command] = [];
    }
    queue[obj.command].push(obj);
  }

  this.get = function get(command) {

    if(queue[command] !== undefined)
    {
      return queue[command];
    }
    return false;
  }

  this.handleQueue = function handleQueue(message) {

    var queuedActions;
    if(queuedActions = this.get(message.command))
    {
      var action = this.getCommand(message.command);
      queuedActions.forEach(function(command, index) {


        if(action(command, message))
        {
          // We have a valid condition. Delete from queue and push
          delete queue[message.command][index];
          this.bot.push(command.message);
        }
      }.bind(this));
    }
  }.bind(this);
}