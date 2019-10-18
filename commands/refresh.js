const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class RefreshCommand extends Command {
  constructor() {
    super('refresh', {
      aliases: ['refresh'],
      channel: 'guild'
    })
  }

  async exec(message) {
    if (!this.client.combat.has(message.author.id)) return message.channel.send('Only usable in combat!');
    const combat = this.client.combat.get(message.author.id);
    combat.currHP = combat.maxhp;
    combat.currMP = combat.maxmp;

    return message.channel.send(`${message.author.username}, your HP and MP have been refreshed!`);
  };
};

module.exports = RefreshCommand;