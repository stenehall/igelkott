var Queue = exports.Queue = function Queue(bot) {

  var queue = [];
  this.bot = bot;

  this.add = function add(obj) {
    queue.push(obj);
  };

  this.remove = function remove(index) {
    delete queue[index];
  };

  this.handleQueue = function handleQueue(message) {
    queue.forEach(function(command, index) {
      if (command.trigger(command, message))
      {
        // We have a valid condition. Delete from queue and push
        this.remove(index);
        this.bot.push(command.message);
      }
    }.bind(this));
  }.bind(this);
};