const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class InviteCommand extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite'],
      category: 'utility',
      description: {
        content: 'Displays an invite to add me to your server, and an invite to join my central server.  Use the `--dm` flag to have it messaged to you instead.',
        usage: 'invite [--dm]',
        example: 'invite --dm'
      },
      args: [
        {
          id: 'dm',
          match: 'flag',
          flag: '--dm'
        }
      ]
    });
  }

  async exec(message, args) {
    if (args.dm) {
      try {
        const embed = new MessageEmbed()
          .setDescription('Invite me to your server with [this link](https://discordapp.com/oauth2/authorize?client_id=337411377796743169&scope=bot&permissions=363584).\nTo join my server, click [this link](https://discord.gg/sMT8bpe).');
        return message.author.send(embed);
      }
      catch (e) {
        message.channel.send(`${e.message}
          ${e.stack}`);
        return message.channel.send('Do you have DMs disabled?  I couldn\'t send a message to you.');
      }
    }
    else {
      try {
        const embed = new MessageEmbed()
          .setDescription('Invite me to your server with [this link](https://discordapp.com/oauth2/authorize?client_id=337411377796743169&scope=bot&permissions=363584).\nTo join my server, click [this link](https://discord.gg/sMT8bpe).');
        return message.channel.send(embed);
      }
      catch (e) {
        message.channel.send('There was an error sending an invite to this channel.  Please try a DM instead, and report it in my central server.');
      }
    }
  }
}

module.exports = InviteCommand;