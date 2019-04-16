const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

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
        const inv = (await this.client.db.query('SELECT inventory.count, inventory.itemid, items.name FROM inventory INNER JOIN items ON inventory.itemid = items.itemid WHERE inventory.playerid = $1 ORDER BY inventory.itemid ASC', [message.author.id])).rows
        const embed = new MessageEmbed()
        .setColor("#e00808")
	    .setTitle(message.author.username + "'s inventory")
	    .setFooter('Information retrieved at:')
	    .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL());
        let invstr = '';
	    for(let i = 0; i < inv.length; i++) {
		    invstr += `${inv[i].name} - ${inv[i].count}\n`
	    }
	    if (invstr.length > 1) {
		    embed.addField("\u200b", invstr);
	    }
	    message.channel.send({ embed: embed })
    }
}

module.exports = InventoryCommand;