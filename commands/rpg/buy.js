const { Command } = require('discord-akairo');

class BuyCommand extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Buys a weapon, armor or accessory from the shop.',
        usage: 'buy (item id | item name)',
        example: 'buy iron dagger'
      }
    })
  }

  async *args(message, parsed, state) {
    const item = yield {
      type: 'string',
      match: 'content'
    }

    return { item }
  }

  async exec(message, { item }) {
    const { gold } = (await this.client.db.query(`
      SELECT
        gold
      FROM
        players
      WHERE
        playerid = $1`,
      [message.author.id])).rows[0];
    const toBuy = this.client.items.find(i => i.id === item) || this.client.items.find(i => i.name === item);
      if (!toBuy) return;
      if (toBuy.cost > gold) {
        return message.answer(message.author, `you don't have enough gold to purchase that!`);
      }
      await this.client.db.query(`
        UPDATE
          players
        SET
          gold = (gold - $1)
        WHERE
          playerid = $2`,
        [toBuy.cost, message.author.id]);
      await this.client.db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT (playeritem) DO UPDATE
        SET
          count = (inventory.count + excluded.count)`,
        [`${message.author.id}-${toBuy.itemid}`, message.author.id, toBuy.itemid, 1]);
      return message.answer(message.author, `you have bought ${toBuy.name} for ${toBuy.cost}g.`);
    }
}

module.exports = BuyCommand;