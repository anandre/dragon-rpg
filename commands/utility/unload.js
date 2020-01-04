const { Command } = require('discord-akairo');

class UnloadCommand extends Command {
  constructor() {
    super('unload', {
      aliases: ['unload'],
      ownerOnly: true,
      category: 'owner',
      args: [
        {
          id: 'commandName'
        }
      ]
    });
  }

  async exec(message, args) {
    try {
      this.client.commandHandler.remove(args.commandName);
      message.channel.send(`${args.commandName} unloaded.`);
    }
    catch (e) {
      message.channel.send(`${e.message}
      ${e.stack}`, { code: 'xxl' });
    }
  }
}

module.exports = UnloadCommand;