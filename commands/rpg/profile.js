const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class ProfileCommand extends Command{
  constructor() {
    super('profile', {
      aliases: ['profile', 'p', 'prof'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Show a user\'s profile.',
        usage: 'profile [@user | user ID | username]',
        example: 'profile [@Mark | 167988857046827010 | Mark#2320]'
      },
      args: [
        {
          id: 'user',
          type: 'user',
          default: message => message.author
        }
      ]
    })
  }

  async exec(message, { user }) {
    if (!this.client.players.includes(user.id)) return;
    const data = (await this.client.db.query(`
      SELECT
        *
      FROM
        players
      WHERE
        playerid = $1`,
      [user.id])).rows[0];
    const embed = new MessageEmbed()
      .setColor("#00FF33")
	    .setThumbnail(user.displayAvatarURL())
	    .setFooter(`Profile requested by ${message.author.username} at`)
	    .setTimestamp()
      .setTitle(`${user.username}'s Profile`)
      .addField('\u200b', stripIndents`**Path**: ${data.path}
        **Level**: ${data.level}
        **XP**: ${data.xp}
        **Gold**: ${data.gold}`, true)
        .addField('\u200b', stripIndents`**HP**: ${data.currhp} / ${data.maxhp}
        **MP**: ${data.currmp} / ${data.maxmp}
        **Strength**: ${data.str}
        **Agility**: ${data.agi}
        **Constitution**: ${data.con}
        **Magic**: ${data.mag}
        **Spirit**: ${data.spr}`, true)
    return await message.channel.send({embed: embed})
  }
}

module.exports = ProfileCommand;