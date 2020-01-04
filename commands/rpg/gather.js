const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class GatherCommand extends Command {
  constructor() {
    super('gather', {
      aliases: ['gather', 'g', 'forage'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Gather restorative herbs',
        usage: 'gather',
        example: 'gather'
      }
    });
  }

  async exec(message) {
    const timer = 1800000;
    const lastGather = await db.query(`
      SELECT
        gathertimer
      FROM
        players
      WHERE
        playerid = $1`,
    [message.author.id]);
    if (parseInt(lastGather.rows[0].gathertimer) + timer < message.createdTimestamp) {
      const gather = await dataManager.functions.gather(message.author.id, message.createdTimestamp);
      let gatherResult = '';
      for (let i = 0; i < gather.length; i += 3) {
        gatherResult += `${gather[i + 1]} ${gather[i]}\n`;
      }
      const embed = new Discord.MessageEmbed()
        .setColor('#e00808')
        .setTitle(`${message.author.username} gathered many ingredients!`)
        .setFooter(`${message.author.username} returned at`)
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL())
        .addField('\u200b', gatherResult);
      await message.channel.send({ embed: embed });
      // await dataManager.functions.checkXP(message)
    }
    else {
      const cdtime = Math.abs(message.createdTimestamp - (parseInt(lastGather.rows[0].gathertimer) + timer));
      return message.answer(message.author, `you have gathered too recently.  You may gather again in ${dataManager.functions.time(cdtime)}.`);
    }
  }
}

module.exports = GatherCommand;