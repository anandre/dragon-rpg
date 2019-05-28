const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class HuntCommand extends Command {
  constructor() {
    super('hunt', {
      aliases: ['hunt', 'h'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Hunt for items needed to upgrade equipment',
        usage: 'hunt',
        example: 'hunt'
      }
    })
  }

  async exec(message) {
    const timer = 1800000;
    const lastHunt = await this.client.db.query(`
      SELECT
        hunttimer
      FROM
        players
      WHERE
        playerid = $1`,
      [message.author.id])
    if (parseInt(lastHunt.rows[0].hunttimer) + timer < message.createdTimestamp) {
      const gold = await this.client.gold(message.author.id);
      const hunt = await this.client.hunt(message.author.id, message.createdTimestamp, gold);
      let huntResult = ''
      for (i = 0; i < hunt.length; i += 3) {
        huntResult += `${hunt[i + 1]} ${hunt[i]}\n`
      }
      huntResult += `You also receive ${gold} gold after selling some meat.`            
      const embed = new MessageEmbed()
        .setColor("#e00808")
        .setTitle(`${message.author.username} had a successful hunt!`)
        .setFooter('The hunt ended at')
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL())
        .addField("On your hunt, you have found", huntResult);  
      await message.channel.send({ embed: embed });
      //await this.client.checkXP(message)
    }
    else {
      let cdtime = Math.abs(message.createdTimestamp - (parseInt(lastHunt.rows[0].hunttimer) + timer));
      return message.answer(message.author, `you have hunted too recently.  You may hunt again in ${this.client.execute(cdtime)}.`)
    }
  }
}

module.exports = HuntCommand;