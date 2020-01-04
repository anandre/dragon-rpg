const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class WearCommand extends Command {
  constructor() {
    super('wear', {
      aliases: ['wear', 'w'],
      channel: 'guild',
      category: 'rpg',
      clientPermissions: ['SEND_MESSAGES'],
      description: {
        content: 'Change your equipment',
        usage: 'wear (item name | id | nothing)',
        example: 'wear iron dagger | idagg | nothing'
      }
    });
  }

  async *args() {
    const text = yield {
      match: 'rest'
    };

    const item = dataManager.items.get(text) || dataManager.items.find(i => i.name === text);
    console.log(item.id);

    return { item };
  }

  async exec(message, { item }) {
    if (!item) {
      return message.answer(message.author, 'there is no such item.');
    }
    console.log(1);
    const inventory = (await db.query(`
      SELECT
        inventory.count
      FROM
        inventory
      WHERE
        playeritem = $1`,
    [`${message.author.id}-${item.id}`])).rows[0];
    if (!inventory) {
      return message.answer(message.author, `you do not have ${item.name}`);
    }
    console.log(2);
    const currentItem = (await db.query(`
      SELECT
        ${item.slot}id
      FROM
        players
      WHERE
        playerid = $1`,
    [message.author.id])).rows[0];
    console.log(currentItem);
    const oldItem = dataManager.items.get(currentItem[`${item.slot}id`]);
    console.log(oldItem);
    try {
      console.log(3);
      await db.query(`
        UPDATE
          players
        SET
          ${item.slot}id = $1
        WHERE
          playerid = $2`,
      [item.id, `${message.author.id}`]);
      console.log(4);
      console.log(oldItem);
      await db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT (playeritem)
        DO UPDATE SET
          count = (inventory.count + excluded.count)`,
      [`${message.author.id}-${oldItem.id}`, message.author.id, oldItem.id, 1]);
      console.log(5);
      await db.query(`
        UPDATE
          inventory
        SET 
          count = (inventory.count - 1)
        WHERE
          playeritem = $1`,
      [`${message.author.id}-${item.id}`]);
      console.log(6);
      await db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT
          (playeritem)
        DO UPDATE SET
          count = (inventory.count + excluded.count)`,
      [`${message.author.id}-${oldItem.id}`, message.author.id, oldItem.id, 1]);
      return message.answer(message.author, `you have removed **${oldItem.name}** and put on **${item.name}**.`);
    }
    catch (error) {
      message.answer(message.author, 'there was a problem running the wear command.  Please report this in my support server.');
      return this.client.channels.get('547399254864560138').send(stripIndents`There was a problem running \`wear\` on ${message.guild.name}.
      \`\`\`xxl
      ${error.message}\`\`\``);
    }
  }
}

module.exports = WearCommand;