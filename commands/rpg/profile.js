const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

class ProfileCommand extends Command {
  constructor() {
    super('profile', {
      aliases: ['profile', 'p', 'prof'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Show a user\'s profile.',
        usage: 'profile [@user | user ID | username]',
        example: 'profile [@Mark | 167988857046827010 | Mark#2320]'
      }
    });
  }

  async *args() {
    const user = yield {
      type: 'user',
      default: message => message.author
    };

    return { user };
  }

  async exec(message, { user }) {
    if (!this.client.players.includes(user.id)) return;
    const res = (await db.query(`
      SELECT
        path, level, xp, gold, currhp, currmp, weaponid, armorid, accessoryid
      FROM
        players
      WHERE
        playerid = $1`,
    [user.id])).rows[0];
    const path = require(join(appDir, `/data/paths/${res.path}.js`));
    const data = new path({
      id: user.id,
      level: res.level,
      xp: res.xp,
      gold: res.gold,
      weaponid: res.weaponid,
      armorid: res.armorid,
      accessoryid: res.accessoryid,
      currHP: res.currhp,
      currMP: res.currmp
    });
    const embed = new MessageEmbed()
      .setColor('#00FF33')
      .setThumbnail(user.displayAvatarURL())
      .setFooter(`Profile requested by ${message.author.username} at`)
      .setTimestamp()
      .setTitle(`${user.username}'s Profile`)
      .addField('\u200b', stripIndents`**Path**: ${data.path}
        **Level**: ${data.level}
        **XP**: ${data.xp}
        **Gold**: ${data.gold}`, true)
      .addField('\u200b', stripIndents`**HP**: ${data.currHP} / ${data.maxHP}
        **MP**: ${data.currMP} / ${data.maxMP}
        **Strength**: ${data.str}
        **Agility**: ${data.agi}
        **Constitution**: ${data.con}
        **Magic**: ${data.mag}
        **Spirit**: ${data.spr}`, true);
    return await message.channel.send({ embed: embed });
  }
}

module.exports = ProfileCommand;