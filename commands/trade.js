const { Command } = require('discord-akairo');

class TradeCommand extends Command {
    constructor() {
        super('trade', {
            aliases: ['trade', 'barter', 'tr'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Starts a trade between you and another player for items or gold.  One item must be offered for another item and/or gold.  If not accepted within 30 seconds, it will automatically be canceled.',
                usage: 'trade (player) (your item to trade) (item you want | gold)',
                example: 'trade `@user` irondagger 450\ntrade `@user` "iron dagger" "steel sword"\ntrade `@user` irondagger steelsword 450'
            }
        })
    }

    async *args(message, parsed, state) {
        const gold = yield {
            type: 'integer',
            default: 0,
            unordered: true
        }
        
        const tradePartner = yield {
            type: 'user'
        }
        
        const used = [... state.usedIndices][0];

        let item = parsed.phrases.map(x => x.raw.replace(/"/g, '').trim());
        if (typeof used != 'undefined') {
            item.splice(used, 1);
        };
        item.splice(item.findIndex(a => a.includes(tradePartner.id)), 1);
        console.log(item);
        
        return { tradePartner, gold, item }
    }

    async exec(message, { tradePartner, item, gold }) {
        await message.channel.send(`${tradePartner}, ${message.author} has offered to trade ${item[0]} for trade.`)
    }
}

module.exports = TradeCommand;