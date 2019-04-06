const { Command } = require('discord-akairo');
const Discord = require('discord.js');

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
        })
    }

    async exec(message) {
        const timer = 3600000;
        const lastFish = await this.client.db.query(`SELECT fishtimer FROM players WHERE playerid = $1`, [message.author.id])
        if (parseInt(lastFish.rows[0].fishtimer) + timer < message.createdTimestamp) {
            console.log('test')
            const fish1 = await this.client.fish(message.author.id, message.createdTimestamp);
            console.log(fish1);
            let fishResult = `You have found ${fish1[1]} ${fish1[0]}.`
            console.log(fishResult);
            const roll2 = Math.random();
            const roll3 = Math.random();
            const roll4 = Math.random();
            const roll5 = Math.random();
            console.log(`fish2 will run if ${roll2} < .75`)
            console.log(`fish3 will run is ${roll3} < .65`)
            console.log(`fish4 will run if ${roll4} < .40`)
            console.log(`fish5 will run if ${roll5} < .25`)
            if (roll2 < .75) {
                const fish2 = await this.client.fish(message.author.id, message.createdTimestamp);
                fishResult += `\nYou have found ${fish2[1]} ${fish2[0]}.`
            }
            if (roll3 < .65) {
                const fish3 = await this.client.fish(message.author.id, message.createdTimestamp);
                fishResult += `\nYou have found ${fish3[1]} ${fish3[0]}.`
            }
            if (roll4 < .4) {
                const fish4 = await this.client.fish(message.author.id, message.createdTimestamp);
                fishResult += `\nYou have found ${fish4[1]} ${fish4[0]}.`
            }
            if (roll5 < .25) {
                const fish5 = await this.client.fish(message.author.id, message.createdTimestamp);
                fishResult += `\nYou have found ${fish5[1]} ${fish5[0]}.`
            }
            const xp = Math.floor(Math.random() * 4 + 1)
            await this.client.addXP(message.author.id, xp);
            const embed = new Discord.MessageEmbed()
                .setColor("#e00808")
                .setTitle(`${message.author.username} had a successful fishing expedition!`)
                .setFooter('The fishing ended at')
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addField("\u200b", fishResult);
            await message.channel.send({embed: embed});
            //await this.client.checkXP(message)
        }
        else {
            let cdtime = Math.abs(message.createdTimestamp - (parseInt(lastFish.rows[0].fishtimer) + timer));
            return message.channel.send(`You have fished too recently.  You may fish again in ${this.client.execute(cdtime)}.`)
        }
    }
}

module.exports = FishCommand;