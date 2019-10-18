const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

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
    })
  }

  async *args(message, parsed, state) {
    const text = yield {
      match: 'rest'
    }

    const item = this.client.items.get(text) || this.client.items.find(i => i.name === text)

    return { item }
  }

  async exec(message, { item }) {
    if (!item) {
      return message.answer(message.author, 'there is no such item.');
    }
    const inventory = (await this.client.db.query(`
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
    const currentItem = (await this.client.db.query(`
      SELECT
        $1
      FROM
        players
      WHERE
        playerid = $2`,
      [`${item.slot}id`, message.author.id])).rows[0];
    try {
      await this.client.db.query(`
        UPDATE
          players
        SET
          $1 = $2
        WHERE
          playerid = $3`,
        [`${item.slot}id`, item.id, message.author.id]);
      await this.client.db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT (playeritem)
        DO UPDATE SET
          count = (inventory.count + excluded.count)`,
        [`${message.author.id}-${currentItem.id}`, message.author.id, currentItem.id, 1]);
      await this.client.db.query(`
        UPDATE
          inventory
        SET 
          count = (inventory.count - 1)
        WHERE
          playeritem = $1`,
        [`${message.author.id}-${item.id}`]);
      await this.client.db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT
          (playeritem)
        DO UPDATE SET
          count = (inventory.count + excluded.count)`,
        [`${message.author.id}-${currentItem.id}`, message.author.id, currentItem.id, 1]);
      return message.answer(message.author, `you have removed **${currentItem.name}** and put on **${item.name}**.`);
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