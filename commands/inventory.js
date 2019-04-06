const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class InventoryCommand extends Command {
    constructor() {
        super('inventory', {
            aliases: ['inventory', 'i', 'inv'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'List your inventory items',
                usage: 'List your inventory items',
                example: 'inventory'
            }
        })
    }

    async exec(message) {
        const inv = (await this.client.db.query(`SELECT ${'inv' + message.author.id}.count, items.name FROM ${'inv' + message.author.id} INNER JOIN items ON ${'inv' + message.author.id}.itemid = items.itemid ORDER BY ${'inv' + message.author.id}.itemid ASC`)).rows
        console.log(inv);
        const embed = new Discord.MessageEmbed()
        .setColor("#e00808")
	    .setTitle(message.author.username + "'s inventory")
	    .setFooter('Information retrieved at:')
	    .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL());
        let invstr = "";
	    for(let i = 0; i < inv.length; i++) {
		    invstr += inv[i].name + " - " + inv[i].count + "\n"
	    }
	    if (invstr.length > 1) {
		    embed.addField("\u200b", invstr);
	    }
	    message.channel.send({ embed: embed })
    }
}

module.exports = InventoryCommand;