const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class TradeCommand extends Command {
  constructor() {
    super('trade', {
      aliases: ['trade', 'barter', 'tr'],
      channel: 'guild',
      category: 'rpg',
      lock: 'user',
      description: {
        content: 'Starts a trade between you and another player for another item and/or gold.' +
        'If not accepted within 30 seconds, it will automatically be canceled.',
        usage: 'trade (player) (your item to trade) (item you want | gold)',
        example: stripIndents`trade \`@user\` irondagger 450g
				trade \`@user\` "iron dagger" "steel sword"
				trade \`@user\` irondagger steelsword 450g`
      }
    });
  }

  async *args(_, parsed, state) {

    const tGold = yield {
      type: (phrase) => {
        const gold = phrase.match(/\b[0-9]*(?=g)/);
        if (!gold) return null;
        return gold[0];
      },
      unordered: true,
      default: 0
    };

    const tradePartner = yield {
      type: 'user',
      default: message => message.author
    };

    const used = [... state.usedIndices][0];

    const item = parsed.phrases.map(x => x.raw.replace(/"/g, '').trim());

    if (typeof used != 'undefined') {
      item.splice(used, 1);
    }
    item.splice(item.findIndex(i => i.includes(tradePartner.id)), 1);

    return { used, item, tGold, tradePartner };
  }

  async exec(message, { tradePartner, item, tGold }) {
    if (!tradePartner) {
      return message.answer(message.author.username, 'you must mention a player to trade with!');
    }
    if (!this.client.players.includes(tradePartner.id) || tradePartner.id === message.author.id) {
      return message.answer(message.author.username, 'that is not a valid player to trade with!');
    }

    const item1 = item[0];
    const item2 = item[1];

    const pItem = dataManager.items.get(item1) || dataManager.items.find(i => i.name === item1);
    let tItem;
    if (item2) {
      tItem = dataManager.items.get(item2) || dataManager.items.find(i => i.name === item2);
    }

    if (!pItem) return message.answer(message.author, 'you have to offer an item for trade.');
    if (!item2 && !tGold) return message.answer(message.author, 'you need to trade for an item or gold in return!');
    if (item2 && !tItem) return message.answer(message.author, 'that\'s not an item you can ask for!');

    let offer = `${tradePartner}, ${message.author} is offering ${pItem.name} for `;
    let success = `${message.author}, you have succesfully traded ${pItem.name} to ${tradePartner} for `;
    const inventories = (await db.query(`
      SELECT
        playerid,
        itemid,
        count
      FROM
        inventory
      WHERE
        playerid IN ($1, $2)`,
    [message.author.id, tradePartner.id])).rows;

    const userInventory = inventories.filter(i => i.playerid === message.author.id);
    const tradeInventory = inventories.filter(i => i.playerid === tradePartner.id);

    if (tGold && !tItem) {
      // ask for gold, no item
      offer += `${tGold}g.  If you accept, please respond with \`yes\`, otherwise respond with \`no\`.`;
      message.channel.send(offer);
      const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
      try {
        const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
        if (['yes', 'y'].includes(resp.first().content.toLowerCase())) {

          const tradeGold = (await db.query(`
            SELECT
              gold
            FROM
              players
            WHERE
              playerid = $1`,
          [tradePartner.id])).rows[0];

          console.log(tGold);
          if (userInventory.findIndex(i => i.itemid === pItem.id) === -1) {
            return message.answer(message.author.username, `you do not have ${pItem.name} in your inventory.`);
          }
          if (tGold > tradeGold.gold) {
            return message.answer(tradePartner.username, 'does not have enough gold!');
          }
          await db.query(`
            UPDATE
              inventory
            SET
              count = (count - 1)
            WHERE
              playeritem = $1`,
          [`${message.author.id}-${pItem.id}`]);
          await db.query(`
            INSERT INTO
              inventory (playeritem, playerid, itemid, count)
            VALUES
              ($1, $2, $3, $4)
            ON CONFLICT (playeritem) DO UPDATE
            SET count = (inventory.count + excluded.count)`,
          [`${tradePartner.id}-${pItem.id}`, tradePartner.id, pItem.id, 1]);
          await db.query(`
            UPDATE
              players
            SET
              gold = (gold + $1)
            WHERE
              playerid = $2`,
          [tGold, message.author.id]);
          await db.query(`
            UPDATE
              players
            SET
              gold = (gold - $1)
            WHERE
              playerid = $2`,
          [tGold, tradePartner.id]);

          success += `${tGold}g.`;
          return message.channel.send(success);
        }

        else if (['no', 'n'].includes(resp.first().content.toLowerCase())) {
          return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
        }
      }
      catch (e) {
        message.channel.send(stripIndents`Error: ${e.message}
        ${e.stack}`, { code: 'xl' });
        return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
      }
    }
    if (tItem) {
      // item for item
      if (tGold) {
        // item for item + gold
        offer += `${tItem.name} and ${tGold}g.  If you accept, please respond with \`yes\`, otherwise respond with \`no\`.`;
        message.channel.send(offer);
        const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
        try {
          const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
          if (['yes', 'y'].includes(resp.first().content)) {
            const tradeGold = (await db.query(`
              SELECT
                gold
              FROM
                players
              WHERE
                playerid = $1`,
            [tradePartner.id])).rows[0];
            console.log(tGold, tradeGold.gold);
            if (!userInventory.some(i => i.id === pItem.id)) {
              return message.answer(message.author, `you do not have ${pItem.name} in your inventory.`);
            }
            if (!tradeInventory.some(i => i.id === tItem.id)) {
              return message.answer(tradePartner, `you don't have ${tItem.name}.`);
            }
            if (tGold > tradeGold.gold) {
              return message.answer(tradePartner, 'does not have enough gold.');
            }
            await db.query(`
              UPDATE
                inventory
              SET
                count = (count - 1)
              WHERE
                playeritem IN ($1, $2)`,
            [`${message.author.id}-${pItem.id}`, `${tradePartner.id}-${tItem.id}`]);
            await db.query(`
              INSERT INTO
                inventory (playeritem, playerid, itemid, count)
              VALUES
                ($1, $2, $3, $4),
                ($5, $6, $7, $8)
              ON CONFLICT (playeritem) DO UPDATE
              SET count = (inventory.count + excluded.count)`,
            [`${tradePartner.id}-${pItem.id}`, tradePartner.id, pItem.id, 1, `${message.author.id}-${tItem.id}`, message.author.id, tItem.id, 1]);
            await db.query(`
              UPDATE
                players
              SET
                gold = (gold + $1)
              WHERE
                playerid = $2`,
            [tGold, message.author.id]);
            await db.query(`
              UPDATE
                players
              SET
                gold = (gold - $1)
              WHERE
                playerid = $2`,
            [tGold, tradePartner.id]);

            success += `${tItem.name} and ${tGold}g.`;
            return message.channel.send(success);

          }
          else if (['no', 'n'].includes(resp.first().content)) {
            return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
          }
        }
        catch (e) {
          message.channel.send(stripIndents`Error: ${e.message}
          ${e.stack}`, { code: 'xl' });
          return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
        }
      }
      else {
        // item for item
        offer += `${tItem.name}.  If you accept, please respond with \`yes\`, otherwise respond with \`no\``;
        message.channel.send(offer);
        const filter = m => m.author.id === tradePartner.id && ['yes', 'no', 'y', 'n'].includes(m.content.toLowerCase());
        try {
          const resp = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
          if (['yes', 'y'].includes(resp.first().content.toLowerCase())) {

            if (!userInventory.some(i => i.id === pItem.id)) {
              return message.answer(message.author, `you do not have ${pItem.name} in your inventory.`);
            }
            if (!tradeInventory.some(i => i.id === tItem.id)) {
              return message.answer(tradePartner, `you don't have ${tItem.name}.`);
            }
            await db.query(`
              UPDATE
                inventory
              SET
                count = (count - 1)
              WHERE
                playeritem = $1`,
            [`${message.author.id}-${pItem.id}`]);
            await db.query(`
              INSERT INTO
                inventory (playeritem, playerid, itemid, count)
              VALUES
                ($1, $2, $3, $4),
                ($5, $6, $7, $8)
              ON CONFLICT (playeritem) DO UPDATE
              SET count = (inventory.count + excluded.count)`,
            [`${tradePartner.id}-${pItem.id}`, tradePartner.id, pItem.id, 1, `${message.author.id}-${tItem.id}`, message.author.id, tItem.id, 1]);

            success += `${tItem.name}.`;
            return message.channel.send(success);
          }
          else if (['no', 'n'].includes(resp.first().content)) {
            return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
          }
        }
        catch (e) {
          message.channel.send(stripIndents`Error: ${e.message}
          ${e.stack}`, { code: 'xl' });
          return message.answer(message.author, `your trade with ${tradePartner} has been canceled.`);
        }
      }
    }
  }
}

module.exports = TradeCommand;