const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class GatherCommand extends Command {
    constructor() {
        super('gather', {
            aliases: ['gather', 'g'],
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
        const timer = 3600000;
        const lastGather = await this.client.db.query(`SELECT gathertimer FROM players WHERE playerid = $1`, [message.author.id])
        if (parseInt(lastGather.rows[0].gathertimer) + timer < message.createdTimestamp) {
            console.log('test')
            const gather1 = await this.client.gather(message.author.id, message.createdTimestamp);
            console.log(gather1);
            let gatherResult = `You have found ${gather1[1]} ${gather1[0]}.`
            console.log(gatherResult);
            const roll2 = Math.random();
            const roll3 = Math.random();
            const roll4 = Math.random();
            const roll5 = Math.random();
            console.log(`gather2 will run if ${roll2} < .75`)
            console.log(`gather3 will run is ${roll3} < .65`)
            console.log(`gather4 will run if ${roll4} < .40`)
            console.log(`gather5 will run if ${roll5} < .25`)
            if (roll2 < .75) {
                const gather2 = await this.client.gather(message.author.id, message.createdTimestamp);
                gatherResult += `\nYou have found ${gather2[1]} ${gather2[0]}.`
            }
            if (roll3 < .65) {
                const gather3 = await this.client.gather(message.author.id, message.createdTimestamp);
                gatherResult += `\nYou have found ${gather3[1]} ${gather3[0]}.`
            }
            if (roll4 < .4) {
                const gather4 = await this.client.gather(message.author.id, message.createdTimestamp);
                gatherResult += `\nYou have found ${gather4[1]} ${gather4[0]}.`
            }
            if (roll5 < .25) {
                const gather5 = await this.client.gather(message.author.id, message.createdTimestamp);
                gatherResult += `\nYou have found ${gather5[1]} ${gather5[0]}.`
            }
            const xp = Math.floor(Math.random() * 4 + 1);
            await this.client.addXP(message.author.id, xp);
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
            return message.channel.send(`You have gathered too recently.  You may gather again in ${this.client.execute(cdtime)}.`)
        }
    }
}

module.exports = GatherCommand;