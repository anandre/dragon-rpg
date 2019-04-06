const { Command } = require('discord-akairo');
const Discord = require('discord.js');

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
        const timer = 3600000;
        console.log('hunting');
        const lastHunt = await this.client.db.query(`SELECT hunttimer FROM players WHERE playerid = $1`, [message.author.id])
        console.log(`lastHunt: ${lastHunt.rows[0].hunttimer} + ${typeof lastHunt.rows[0].hunttimer}`)
        console.log(`lastHunt + timer: ${lastHunt.rows[0].hunttimer + timer}`)
        console.log(`messageCreated: ${message.createdTimestamp}`)
        //console.log(message.createdTimestamp)
        //console.log(message.createdTimestamp - lastHunt.rows[0].hunttimer)
        if (parseInt(lastHunt.rows[0].hunttimer) + timer < message.createdTimestamp) {
            console.log('test')
            const hunt1 = await this.client.hunt(message.author.id, message.createdTimestamp);
            console.log(hunt1);
            const gold = await this.client.gold(message.author.id);
            console.log(gold);
            let huntResult = `You have found ${hunt1[1]} ${hunt1[0]}.`
            console.log(huntResult);
            const roll2 = Math.random();
            const roll3 = Math.random();
            const roll4 = Math.random();
            const roll5 = Math.random();
            console.log(`hunt2 will run if ${roll2} < .75`)
            console.log(`hunt3 will run is ${roll3} < .65`)
            console.log(`hunt4 will run if ${roll4} < .40`)
            console.log(`hunt5 will run if ${roll5} < .25`)
            if (roll2 < .75) {
                const hunt2 = await this.client.hunt(message.author.id, message.createdTimestamp);
                huntResult += `\nYou have found ${hunt2[1]} ${hunt2[0]}.`
            }
            if (roll3 < .65) {
                const hunt3 = await this.client.hunt(message.author.id, message.createdTimestamp);
                huntResult += `\nYou have found ${hunt3[1]} ${hunt3[0]}.`
            }
            if (roll4 < .4) {
                const hunt4 = await this.client.hunt(message.author.id, message.createdTimestamp);
                huntResult += `\nYou have found ${hunt4[1]} ${hunt4[0]}.`
            }
            if (roll5 < .25) {
                const hunt5 = await this.client.hunt(message.author.id, message.createdTimestamp);
                huntResult += `\nYou have found ${hunt5[1]} ${hunt5[0]}.`
            }
            huntResult += `\nYou also received ${gold} gold for your successful hunt.`
            const xp = Math.floor(Math.random() * 2 + 1);
            await this.client.addXP(message.author.id, xp);
            const embed = new Discord.MessageEmbed()
                .setColor("#e00808")
                .setTitle(`${message.author.username} had a successful hunt!`)
                .setFooter('The hunt ended at')
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addField("\u200b", huntResult);  
            await message.channel.send({embed: embed});
            //await this.client.checkXP(message)
        }
        else {
            let cdtime = Math.abs(message.createdTimestamp - (parseInt(lastHunt.rows[0].hunttimer) + timer));
            return message.channel.send(`You have hunted too recently.  You may hunt again in ${this.client.execute(cdtime)}.`)
        }
    }

}

module.exports = HuntCommand;