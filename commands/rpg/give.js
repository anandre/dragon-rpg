const { Command } = require('discord-akairo');

class GiveCommand extends Command {
  constructor() {
    super('give', {
      aliases: ['give'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Gives a specified item or amount of gold to another player.',
        usage: 'give (user) (item | gold)',
        example: 'give `@user` irondagger\ngive `@user` 450g'
      }
    })
  }

  async *args(message, parsed, state) {
    const recip = yield {
      type: 'user',
    }

    const give = yield {
      type: 'string',
      match: 'rest'
    }

    console.log(give);

    return { recip, give };
  }

  async exec(message, { recip, give }) {
    if (!this.client.players.includes(recip.id) || recip.id === message.author.id) {
      return message.answer(message.author, `you cannot give an item to that player.`);
    }
    const item = this.client.items.find(i => i.id === give) || this.client.items.find(i => i.name === give);
    if (!item) {
      if (give.match(/\b[0-9]*(?=g)/)) { //gold instead
        const pGold = (await this.client.db.query(`
          SELECT
            gold
          FROM
            players
          WHERE
            playerid = $1`,
          [message.author.id])).rows[0].gold;
        const gGold = parseInt(give.match(/\b[0-9]*(?=g)/)[0]);
        if (gGold > pGold) {
          return message.answer(message.author, `you don't have enough gold, you're only carrying ${pGold}g.`);
        }
        await this.client.db.query(`
          UPDATE  
            players
          SET
            gold = (gold + $1)
          WHERE
            playerid = $2`,
          [gGold, recip.id]);
        await this.client.db.query(`
          UPDATE
            players
          SET
            gold = (gold - $1)
          WHERE
            playerid = $2`,
          [gGold, message.author.id]);
        return message.answer(message.author, `you gave ${recip.username} ${gGold}g.`);
      }
      else {
        return message.answer(message.author, 'that is not a valid item to give.');
      }
    }

    if (item) {
      console.log(item);
      const pInv = (await this.client.db.query(`
       SELECT
        count
       FROM
        inventory
      WHERE
        playeritem = $1`,
      [`${message.author.id}-${item.itemid}`])).rows;
      console.log(pInv);
      if (pInv.length === 0) {
        return message.answer(message.author, `you do not have ${item.name} in your inventory!`);
      } 
      await this.client.db.query(`
        INSERT INTO
          inventory (playeritem, playerid, itemid, count)
        VALUES
          ($1, $2, $3, $4)
        ON CONFLICT (playeritem) DO UPDATE
        SET count = (inventory.count + excluded.count)`,
        [`${recip.id}-${item.itemid}`, recip.id, item.itemid, 1]);
      await this.client.db.query(`
        UPDATE
          inventory
        SET
          count = (count - 1)
        WHERE
          playeritem = $1`,
        [`${message.author.id}-${item.itemid}`]);
      return message.answer(message.author, `you gave ${recip.username} ${item.name}`);
    }
  }
}

module.exports = GiveCommand;