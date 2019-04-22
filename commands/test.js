const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test', 't'],
            ownerOnly: true
        })
    }

    async *args(message, parsed, state) {
        /*let gold = yield {
            type: /\b[0-9]*(?=g)/,
            unordered: true,
            default: 0
        }
        
        if (gold) gold = gold.match[0];
        else gold = 0;*/

        const gold = yield {
            type: (message, phrase) => {
                const gold = phrase.match(/\b[0-9]*(?=g)/);
                if (!gold) return null;
                return gold;
            },
            unordered: true,
            default: 0
        }

        const tradePartner = yield {
            type: 'user',
            default: message => message.author
        }

        console.log([... state.usedIndices])
        const used = [... state.usedIndices][0];

        let item = parsed.phrases.map(x => x.raw.replace(/"/g, '').trim());
        console.log(item);
        if (typeof used != 'undefined') {
            item.splice(used, 1);
        };
        item.splice(item.findIndex(i => i.includes(tradePartner.id)), 1);
        //item = item.join(' ');

        return { used, item, gold, tradePartner };
    }

    async exec(message, { used, item, gold, tradePartner}) {
        if (!tradePartner) return message.channel.send(`${message.author.username}, you must mention a player to trade with!`);
        if (!this.client.players.includes(tradePartner.id) || tradePartner.id === message.author.id) return message.channel.send(`${message.author.username}, that is not a valid player to trade with!`);

        const item1 = item[0];
        const item2 = item[1];
        
        const playerItem = this.client.infoItems.find(i => i.id === item1) || this.client.infoItems.find(i => i.name === item1);
        let itemTrade;
        if (item2) {
            itemTrade = this.client.infoItems.find(i => i.id === item2) || this.client.infoItems.find(i => i.name === item2);
        }

        if (!playerItem) return message.channel.send(`${message.author.username}, you have to offer an item for trade.`);
        if (!item2 && !gold) return message.channel.send(`${message.author.username}, you need to trade for an item or gold in return!`);
        if (item2 && !itemTrade) return message.channel.send(`${message.author.username}, that's not an item you can ask for!`);

        /*const inventories = (await this.client.db.query('SELECT playerid, itemid, count FROM inventory WHERE playerid IN ($1, $2)', [message.author.id, tradePartner.id])).rows;
        const userInventory = inventories.filter(i => i.playerid === message.author.id);
        const tradeInventory = inventories.filter(i => i.playerid === tradePartner.id);

        if (userInventory.findIndex(i => i.itemid === playerItem.itemid) === -1) return message.channel.send(`${message.author.username}, you do not have ${playerItem.name} in your inventory.`);*/
        if (gold && !itemTrade) {
            message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${gold}g.`);
        }
        if (itemTrade) {
            //if (tradeInventory.findIndex(i => i.itemid === tradeItem.itemid) === -1) return message.channel.send(`${tradePartner.username} does not have that item in their inventory.`);
            if (gold) {
                message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${itemTrade.name} and ${gold}g.`);
            }
            else {
                message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${itemTrade.name}.`);
            }
        }        
        //check this logic for there's no item asked for, only gold
        //if (tradeInventory.findIndex(i => i.itemid === tradeItem.itemid) === -1) return message.channel.send(`${tradePartner.username} does not have that item in their inventory.`);
        message.channel.send(stripIndents`gold: ${gold}
        tradePartner: ${tradePartner.username}
        playerItem: ${playerItem}
        tradeItem: ${tradeItem}
        used: ${used}
        item: ${item}`)
        
    }
}

module.exports = TestCommand;