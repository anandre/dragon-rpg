const { Command } = require('discord-akairo');

class SellCommand extends Command {
  constructor() {
    super('sell', {
      aliases: ['sell'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Sell an item to a shop for gold.',
        usage: 'sell (item)',
        example: 'sell irondagger\nsell "iron dagger"'
      }
    })
  }

  async *args(message, parsed, stated) {
    const item = yield {
      type: 'string',
      match: 'phrase'
    };

    return { item };
  }

  async exec(message, { item }) {
    const sold = this.client.infoItems.find(i => i.id === item) || this.client.infoItems.find(i => i.name === item);
    if (!sold) {
      return message.answer(message.author, 'there is no item like that.');
    }

    const inventory = (await this.client.db.query(`
      SELECT
        itemid,
        count
      FROM
        inventory
      WHERE
        playerid = $1`,
      [message.author.id])).rows;

    if (!inventory.some(i => i.itemid === sold.itemid)) {
     return message.answer(message.author, `you do not have ${sold.name} in your inventory.`);
    }

    await this.client.db.query(`
      UPDATE
        players
      SET
        gold = (gold + $1)
      WHERE
        playerid = $2`,
      [sold.sell, message.auhor.id]);
    await this.client.db.query(`
      UPDATE
        inventory
      SET
        count = (count - 1)
      WHERE
        playeritem = $1`,
      [`${message.author.id}-${sold.itemid}`]);

    return message.answer(message.author, `you sold ${sold.name} for ${sold.sell}g.`);
  }
}

module.exports = SellCommand;