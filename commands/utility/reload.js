const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
  constructor() {
    super('reload', {
      aliases: ['reload'],
      ownerOnly: true,
      category: 'owner',
      args: [
        {
          id: 'commandName'
        },
        {
          id: 'listener',
          match: 'flag',
          flag: '--listener'
        },
        {
          id: 'inhib',
          match: 'flag',
          flag: '--inhib'
        }
      ]
    });
  }

  exec(message, args) {
    if (args.listener) {
      try {
        this.client.listenerHandler.reload(args.commandName);
        return message.channel.send(`Reloaded listener: ${args.commandName}`);
      }
      catch (e) {
        message.channel.send(`Error reloading listener.
        ${e.message}
        ${e.stack}`, { code: 'xxl' });
      }
    }
    if (args.inhib) {
      try {
        this.client.inhibitorHandler.reload(args.commandName);
        return message.channel.send(`Reloaded inhibitor: ${args.commandName}`);
      }
      catch (e) {
        message.channel.send(`Error reloading inhibitor.
          ${e.message}
          ${e.stack}`, { code: 'xxl' });
      }
    }
    else {
      try {
        if (!this.client.commandHandler.modules.has(args.commandName)) return (message.channel.send('Command not found.'));
        this.handler.reload(args.commandName);
        return message.channel.send(`Reloaded command: ${args.commandName}.`);
      }
      catch (e) {
        message.channel.send(`Error reloading command.
          ${e.message}
          ${e.stack}`, { code: 'xxl' });
      }
    }
  }
}

module.exports = ReloadCommand;