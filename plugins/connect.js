/*
 * @CorePlugin
 * @Description: Joins channels and sets nick on connect, should probably be in
 * bot.js
 *
 * @Status: Very unstable
 */
var Plugin = exports.Plugin = function plugin (bot) {

  this.listeners = {connect: 'connect'};
  bot.pluginCore.apply(this, [bot]);

  this.connect = function connect ()
  {
    this.bot.push({command: "NICK", parameters: ["atti"]});

    var message = {
      'command': 'USER',
      'parameters': [ 'atti', '0', '*', ':atti' ] // This is just stupid stupid stupid. Stupid, stupid stupid. Stupid...
    };

    this.bot.push(message);
  }.bind(this);
}