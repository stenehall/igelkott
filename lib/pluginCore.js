exports.pluginCore = function pluginCore (bot) {

  this.bot = bot;

  /*
   * Adds listeners for the plugin.
   */
  this.On = function On () {

    if (this.dbConfig !== undefined)
    {
      for(var tableName in this.dbConfig.tables) {
        this.bot.db.createTable(tableName, this.dbConfig.tables[tableName]);
      }
    }

    for (key in this.listeners)
    {
      this.bot.on(key, this[this.listeners[key]]);
    }
  }.bind(this);

  /*
   * Removes all listeners added by On
   */
  this.Off = function Off () {
    for (key in this.listeners)
    {
      this.bot.removeListener(key, this[this.listeners[key]]);
      delete this.bot._events[key];
    }
  }.bind(this);

}