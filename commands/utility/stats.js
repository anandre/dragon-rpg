const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class StatsCommand extends Command {
  constructor() {
    super('stats', {
      aliases: ['stats', 'st'],
      channel: 'guild',
      category: 'utility',
      description: {
        content: 'Displays usage stats for the bot.',
        usage: 'stats',
        example: 'stats'
      }
    });
  }

  async exec(message) {
    const uptime = this.client.execute(this.client.uptime);
    const memoryUsed = Number.parseFloat(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const dVersion = 'Discord.js v12.0.0';
    const aVersion = 'Akairo v8.0.0';
    const channels = this.client.channels.size;
    const guilds = this.client.guilds.size;
    const members = this.client.guilds.map(g => g.memberCount).reduce((a, b) => a + b);
    const embed = new MessageEmbed()
      .setThumbnail(this.client.user.displayAvatarURL())
      .setTitle('Dragon RPG Stats')
      .addField('General Stats', stripIndents`**Guilds**: ${guilds}
        **Channels**: ${channels}
        **Users**: ${members}`, true)
      .addField('Technical Stats', stripIndents`**Uptime**: ${uptime}
        **RAM Use**: ${memoryUsed} MB
        **Disord Library**: [${dVersion}](https://discord.js.org/#/docs/main/master/)
        **Framework**: [${aVersion}](https://www.npmjs.com/package/discord-akairo)`, true);
    return message.channel.send(embed);
  }
}

module.exports = StatsCommand;