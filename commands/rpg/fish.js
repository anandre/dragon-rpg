const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class FishCommand extends Command {
  constructor() {
    super('fish', {
      aliases: ['fish'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Fish to gather restorative items',
        usage: 'fish',
        example: 'fish'
      }
    });
  }

  async exec(message) {
    const timer = 1800000;
    const lastFish = await db.query(`
      SELECT
        fishtimer
      FROM
        players
      WHERE
        playerid = $1`,
    [message.author.id]);
    if (parseInt(lastFish.rows[0].fishtimer) + timer < message.createdTimestamp) {
      const fish = await dataManager.functions.fish(message.author.id, message.createdTimestamp);
      let fishResult = '';
      for (let i = 0; i < fish.length; i += 3) {
        fishResult += `${fish[i + 1]} ${fish[i]}\n`;
      }
      const embed = new MessageEmbed()
        .setColor('#e00808')
        .setTitle(`${message.author.username} had a successful fishing expedition!`)
        .setFooter('The fishing ended at')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL())
        .addField('\u200b', fishResult);
      await message.channel.send({ embed: embed });
      // await this.client.checkXP(message)
    }
    else {
      const cdtime = Math.abs(message.createdTimestamp - (parseInt(lastFish.rows[0].fishtimer) + timer));
      return message.answer(message.author, `you have fished too recently.  You may fish again in ${dataManager.functions.time(cdtime)}.`);
    }
  }
}

module.exports = FishCommand;