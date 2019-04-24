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

  async exec(message, { used, item, gold, tradePartner}) {
    const inventories = (await this.client.db.query(`
            SELECT
              playerid,
              itemid,
              count
            FROM
              inventory
            WHERE
              playerid IN ($1, $2)
          `, [message.author.id, tradePartner.id])).rows
    console.table(inventories);
  }
}

module.exports = TestCommand;