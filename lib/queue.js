var Queue = exports.Queue = function Queue(bot) {

  var queue = [];
  this.bot = bot;

  this.add = function add(obj) {
    return queue.push(obj);
  };

  this.remove = function remove(index) {
    delete queue[index];
  };

  this.handleQueue = function handleQueue(message) {
    queue.forEach(function(command, index) {
      if (command.trigger(command, message))
      {
        this.remove(index);

        // We have a valid condition. Delete from queue and push
        if(/^internal/.test(command.message.command)) {
          this.bot.emit(command.message.command, command.message);
        } else {
          this.bot.push(command.message);
        }
      }
    }.bind(this));
  }.bind(this);
};