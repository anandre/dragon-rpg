const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class UseCommand extends Commands {
    constructor() {
        super('use', {
            aliases: ['use'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Use an item to restore HP or MP.  If in combat, it will always use 1 item per use.',
                usage: 'use (item name) [amount]',
                example: 'use mushrooms'
            },
            
        })
    }

    async *args(message, parsed, state) {
        const amount = yield {
            type: 'integer',
            unordered: true,
            default: 1
        };
        const used = [... state.usedIndices][0];

        let item = parsed.phrases.map(x => x.raw.trim());
        if (typeof used != 'undefined') {
            item.splice(used, 1);
        };
        item = item.join(' ');

        return { amount, used, item };
    }

    async exec(message, { amount, used, item }) {
        if (!this.client.infoItems.filter(i => i.effects).some(i => [i.id, i.name].includes(item))) return;
        const usedItem = this.client.infoItems.find(i => i.id === item) || this.client.infoItems.find(i => i.name === item);
        const inventory = (await this.client.db.query('SELECT * FROM $1')).rows;

        if (!inventory.some(i => i.itemid === usedItem.itemid)) return message.channel.send(`${message.author.username}, you don't have that item!`);
        
        const effect = usedItem.effects.match(/[\d]+-[\d]+/g)[0].split('-').map(e => parseInt(e));
        const type = usedItem.effects.match(/HP|MP/g)[0];

        const transfer = {
            HP: currhp,
            MP: currmp
        }

        let i = 0;
        let totalRestored = 0;
        while (i < amount) {
            totalRestored += Math.floor(Math.random() * (effect[1] - effect[0] + 1) + effect[0]);
            i++;
        };

        try {
            await this.client.db.query('UPDATE players SET $1 = $2 WHERE playerid = $3', [transfer[type], transfer[type] + totalRestored, message.author.id]);
        }
        catch (e) {
            message.channel.send(stripIndents`${e.message}
            ${e.stack}`, { code: xxl });
        }
        
        if (this.client.combat.has(message.author.id)) {
            amount = 1;
        }
    }
}

module.exports = UseCommand;