const { Command } = require('discord-akairo');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

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
    });
  }

  async *args() {
    const item = yield {
      type: 'string',
      match: 'content'
    };

    return { item };
  }

  async exec(message, { item }) {
    const shopItems = dataManager.items.filter(i => i.source === 'shop');
    const toBuy = shopItems.items.get(item) || shopItems.find(i => i.name === item);
    if (!toBuy) return;

    const { gold } = (await db.query(`
      SELECT
        gold
      FROM
        players
      WHERE
        playerid = $1`,
    [message.author.id])).rows[0];

    if (toBuy.cost > gold) {
      return message.answer(message.author, 'you don\'t have enough gold to purchase that!');
    }
    await db.query(`
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