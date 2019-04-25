const { Command } = require('discord-akairo');
const Discord = require('discord.js');

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
        })
    }

    async exec(message) {
        const timer = 1800000;
        const lastGather = await this.client.db.query(`SELECT gathertimer FROM players WHERE playerid = $1`, [message.author.id])
        if (parseInt(lastGather.rows[0].gathertimer) + timer < message.createdTimestamp) {
            const gather = await this.client.gather(message.author.id, message.createdTimestamp);
            let gatherResult = ''
            for (i = 0; i < gather.length; i += 3) {
                gatherResult += `${gather[i + 1]} ${gather[i]}\n`
            }
            const embed = new Discord.MessageEmbed()
                .setColor("#e00808")
                .setTitle(`${message.author.username} gathered many ingredients!`)
                .setFooter(`${message.author.username} returned at`)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addField("\u200b", gatherResult);  
            await message.channel.send({embed: embed});
            //await this.client.checkXP(message)
        }
        else {
            let cdtime = Math.abs(message.createdTimestamp - (parseInt(lastGather.rows[0].gathertimer) + timer));
            return message.channel.send(`${message.author.username}, you have gathered too recently.  You may gather again in ${this.client.execute(cdtime)}.`)
        }
    }
}

module.exports = GatherCommand;