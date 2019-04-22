const { Command } = require('discord-akairo');

class TradeCommand extends Command {
    constructor() {
        super('trade', {
            aliases: ['trade', 'barter', 'tr'],
            channel: 'guild',
            category: 'rpg',
            lock: 'user',
            description: {
                content: 'Starts a trade between you and another player for another item and/or gold.  If not accepted within 30 seconds, it will automatically be canceled.',
                usage: 'trade (player) (your item to trade) (item you want | gold)',
                example: 'trade `@user` irondagger 450g\ntrade `@user` "iron dagger" "steel sword"\ntrade `@user` irondagger steelsword 450g'
            }
        })
    }

    async *args(message, parsed, state) {
        
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

        const used = [... state.usedIndices][0];

        let item = parsed.phrases.map(x => x.raw.replace(/"/g, '').trim());
        
        if (typeof used != 'undefined') {
            item.splice(used, 1);
        };
        item.splice(item.findIndex(i => i.includes(tradePartner.id)), 1);

        return { used, item, gold, tradePartner };
    }

    async exec(message, { tradePartner, item, gold }) {
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


        if (gold && !itemTrade) { //ask for gold, no item
            message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${gold}g.  If you accept, please respond with \`yes\`, otherwise respond with \`no\`.`);
            const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
            try {
                const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                if (['yes', 'y'].includes(resp.first().content)) {
                    const inventories = (await this.client.db.query('SELECT playerid, itemid, count FROM inventory WHERE playerid IN ($1, $2)', [message.author.id, tradePartner.id])).rows;
                    const { tradeGold } = (await this.client.db.query('SELECT gold FROM players WHERE playerid = $1', [message.author.id])).rows[0];
                    const userInventory = inventories.filter(i => i.playerid === message.author.id);
                    const tradeInventory = inventories.filter(i => i.playerid === tradePartner.id);
            
                    if (userInventory.findIndex(i => i.itemid === playerItem.itemid) === -1) return message.channel.send(`${message.author.username}, you do not have ${playerItem.name} in your inventory.`);
                    if (gold > tradeGold) return message.channel.send(`${tradePartner.username} does not have enough gold!`);

                    await this.client.db.query('UPDATE inventory SET count = (count - 1) WHERE playeritem = $1', [`${message.author.id}-${playerItem.itemid}`]);
                    await this.client.db.query('INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES ($1, $2, $3, $4) ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)', [`${tradePartner.id}-${playerItem.id}`, tradePartner.id, playerItem.id, 1]);
                    await this.client.db.query('UPDATE players SET gold = (gold + $1) WHERE playerid = $2', [gold, message.author.id]);
                    await this.client.db.query('UPDATE players SET gold = (gold - $1) WHERE playerid = $2', [gold, tradePartner.id]);

                    return message.channel.send(`${message.author.username}, you have successfully traded your ${playerItem.name} to ${tradePartner.username} for ${gold}g.`);
                    
                }

                else if (['no', 'n'].includes(resp.first().content)) {
                    return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
                }
            }
            catch (e) {
                return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
            }
        }
        if (itemTrade) { //item for item
            if (gold) { //item for item + gold
                message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${itemTrade.name} and ${gold}g.  If you accept, please respond with \`yes\`, otherwise respond with \`no\`.`);
                const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
            try {
                const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                if (['yes', 'y'].includes(resp.first().content)) {
                    const inventories = (await this.client.db.query('SELECT playerid, itemid, count FROM inventory WHERE playerid IN ($1, $2)', [message.author.id, tradePartner.id])).rows;
                    const { tradeGold } = (await this.client.db.query('SELECT gold FROM players WHERE playerid = $1', [message.author.id])).rows[0];
                    const userInventory = inventories.filter(i => i.playerid === message.author.id);
                    const tradeInventory = inventories.filter(i => i.playerid === tradePartner.id);
            
                    if (userInventory.findIndex(i => i.itemid === playerItem.itemid) === -1) return message.channel.send(`${message.author.username}, you do not have ${playerItem.name} in your inventory.`);
                    if (tradeInventory.findIndex(i => i.itemid === itemTrade.itemid) === -1) return message.channel.send(`${tradePartner}, you don't have ${itemTrade.name}.`);
                    if (gold > tradeGold) return message.channel.send(`${tradePartner.username} does not have enough gold.`);

                    await this.client.db.query('UPDATE inventory SET count = (count - 1) WHERE playeritem IN ($1, $2)', [`${message.author.id}-${playerItem.itemid}`, `${tradePartner.id}-${itemTrade.itemid}`]);
                    //await this.client.db.query('UPDATE inventory SET count = (count - 1) WHERE playeritem = $1', [`${message.author.id}-${playerItem.itemid}`]);
                    //await this.client.db.query('UPDATE inventory SET count = (count - 1) WHERE playeritem = $1', [`${tradePartner.id}-${itemTrade.itemid}`]);
                    await this.client.db.query('INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8) ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)', [`${tradePartner.id}-${playerItem.id}`, tradePartner.id, playerItem.id, 1, `${message.author.id}-${itemTrade.itemid}`, message.author.id, itemTrade.itemid, 1]);
                    await this.client.db.query('UPDATE players SET gold = (gold + $1) WHERE playerid = $2', [gold, message.author.id]);
                    await this.client.db.query('UPDATE players SET gold = (gold - $1) WHERE playerid = $2', [gold, tradePartner.id]);

                    return message.channel.send(`${message.author.username}, you have successfully traded your ${playerItem.name} to ${tradePartner.username} for ${itemTrade.name} and ${gold}g.`);
                    
                }

                else if (['no', 'n'].includes(resp.first().content)) {
                    return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
                }
            }
            catch (e) {
                return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
            }
            }
            else { //item for item
                message.channel.send(`${tradePartner.username}, ${message.author.username} is offering ${playerItem.name} in exchange for ${itemTrade.name}.  If you accept, please respond with \`yes\`, otherwise respond with \`no\`.`);
                const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
            try {
                const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
                if (['yes', 'y'].includes(resp.first().content)) {
                    const inventories = (await this.client.db.query('SELECT playerid, itemid, count FROM inventory WHERE playerid IN ($1, $2)', [message.author.id, tradePartner.id])).rows;
                    const userInventory = inventories.filter(i => i.playerid === message.author.id);
                    const tradeInventory = inventories.filter(i => i.playerid === tradePartner.id);
            
                    if (userInventory.findIndex(i => i.itemid === playerItem.itemid) === -1) return message.channel.send(`${message.author.username}, you do not have ${playerItem.name} in your inventory.`);
                    if (tradeInventory.findIndex(i => i.itemid === itemTrade.itemid) === -1) return message.channel.send(`${tradePartner}, you don't have ${itemTrade.name}.`);
                    
                    await this.client.db.query('UPDATE inventory SET count = (count - 1) WHERE playeritem IN ($1, $2)', [`${message.author.id}-${playerItem.itemid}`, `${tradePartner.id}-${itemTrade.itemid}`]);
                    await this.client.db.query('INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8) ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)', [`${tradePartner.id}-${playerItem.id}`, tradePartner.id, playerItem.id, 1, `${message.author.id}-${itemTrade.itemid}`, message.author.id, itemTrade.itemid, 1]);
                    
                    return message.channel.send(`${message.author.username}, you have successfully traded your ${playerItem.name} to ${tradePartner.username} for ${itemTrade.name}.`);
                    
                }

                else if (['no', 'n'].includes(resp.first().content)) {
                    return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
                }
            }
            catch (e) {
                return message.channel.send(`Trade between ${message.author} and ${tradePartner} has been canceled.`);
            }
            }
        }
    }
}

module.exports = TradeCommand;