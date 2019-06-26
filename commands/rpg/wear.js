const { Command } = require('discord-akairo');

class WearCommand extends Command {
  constructor() {
    super('wear', {
      aliases: ['wear', 'w'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Change your equipment',
        usage: 'wear (item name | item nickname | nothing)',
        example: 'wear iron dagger | irondagger | nothing'
      },
      args: [{
        id: 'item',
        match: "rest"
      }]
    })
  }

  async exec(message, args) {
    const inventory = (await this.client.db.query(`
      SELECT
        inventory.count, items.slot, items.itemid, items.name, items.strmod, items.agimod, items.id,
        items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.gathertimermod,
        items.fishtimermod, items.hunttimermod
      FROM
        inventory
      INNER JOIN
        items
      ON
        inventory.itemid = items.itemid
      WHERE
        inventory.playerid = '${message.author.id}'`)).rows
    let wearing = [];
    const currentStats = (await this.client.db.query(`
      SELECT
        str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, gathermod, fishmod, huntmod
      FROM
        players
      WHERE
        playerid = $1`,
      [message.author.id])).rows[0];
    const putOn = inventory.find(it => it.id === args.item) || inventory.find(it => it.name === args.item);
    const weapon = (await this.client.db.query(`
      SELECT
        players.weaponid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod,
        items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod,
        items.hunttimermod, items.slot
      FROM
        players
      INNER JOIN
        items
      ON
        players.weaponid = items.itemid
      WHERE
        playerid = '${message.author.id}'`)).rows[0]
    const armor = (await this.client.db.query(`
      SELECT
        players.armorid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod,
        items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod,
        items.hunttimermod, items.slot
      FROM
        players
      INNER JOIN
        items
      ON
        players.armorid = items.itemid
      WHERE
        playerid = '${message.author.id}'`)).rows[0]
    const accessory = (await this.client.db.query(`
      SELECT
        players.accessoryid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod,
        items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod,
        items.hunttimermod, items.slot
      FROM
        players
      INNER JOIN
        items
      ON
        players.accessoryid = items.itemid
      WHERE
        playerid = '${message.author.id}'`)).rows[0]
    wearing.push(weapon, armor, accessory)
    if (args.item === 'nothing') {
      try {
        await this.client.db.query(`
          INSERT INTO
            inventory (playeritem, playerid, itemid, count)
          VALUES
            ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)
          ON CONFLICT (playeritem)
          DO UPDATE SET
            count = (inventory.count + excluded.count)`,
          [`${message.author.id}-${weapon.itemid}`, messag.author.id, weapon.itemid, 1,
          `${message.author.id}-${armor.itemid}`, message.author.id, armor.itemid, 1,
          `${message.author.id}-${accessory.itemid}`, message.author.id, accessory.itemid, 1]);
        await this.client.db.query(`
          UPDATE
            players
          SET
            armorid = 47, weaponid = 46, accessoryid = 48
          WHERE
            playerid = '${message.author.id}'`)
        return message.channel.send('You have removed your equipment.');
      }
      catch (e) {
        message.channel.send('There was a problem, please come to the support server if help is needed.  An invite can be found in the `?invite` command.');
        this.client.channels.get('547399254864560138').send(`Error when trying to equip nothing for ${message.author.id}. ${e.message}
        ${e.stack}`)
      }
    }
    if (putOn && wearing.find(e => e.name === putOn.name && e.slot === putOn.slot)) {
      return message.reply('you\'re already wearing that!');
    }
    else if (putOn && !wearing.some(e => e.name === putOn.name)) {
      const currentItem = wearing.find(s => s.slot === putOn.slot);
      const strChange = currentStats.str - currentItem.strmod + putOn.strmod;
      const agiChange = currentStats.agi - currentItem.agimod + putOn.agimod;
      const conChange = currentStats.con - currentItem.conmod + putOn.conmod;
      const magChange = currentStats.mag - currentItem.magmod + putOn.magmod;
      const sprChange = currentStats.spr - currentItem.sprmod + putOn.sprmod;
      const hpChange = currentStats.maxhp - currentItem.hpmod + putOn.hpmod;
      const mpChange = currentStats.maxmp - currentItem.mpmod + putOn.mpmod;
      const currHPChange = currentStats.currhp - currentItem.hpmod + putOn.hpmod;
      const currMPChange = currentStats.currmp - currentItem.mpmod + putOn.mpmod;
      const huntChange = currentStats.huntmod / currentItem.hunttimermod * putOn.hunttimermod;
      const fishChange = currentStats.fishmod / currentItem.fishtimermod * putOn.fishtimermod;
      const gatherChange = currentStats.gathermod / currentItem.gathertimermod * putOn.gathertimermod;
      const newSlot = {
        'a': 'armorid',
        'c': 'accessoryid',
        'w': 'weaponid'
      }
      try {
        if (currentItem.name !== 'nothing') {
          await this.client.db.query(`
            INSERT INTO
              inventory (playeritem, playerid, itemid, count)
            VALUES
              ($1, $2, $3, $4)
            ON CONFLICT (playeritem)
            DO UPDATE SET
              count = (inventory.count + excluded.count)`,
            [`${message.author.id}-${currentItem.itemid}`, message.author.id, currentItem.itemid, 1]);
        }
        await this.client.db.query(`
          UPDATE
            inventory
          SET
            count = (inventory.count - 1)
          WHERE
            playeritem = $1`,
          [`${message.author.id}-${putOn.itemid}`]);
        await this.client.db.query(`
          UPDATE
            players
          SET
            ${newSlot[putOn.slot]} = ${putOn.itemid},
            str = ${strChange}, agi = ${agiChange}, con = ${conChange},
            mag = ${magChange}, spr = ${sprChange}, currhp = ${currHPChange},
            maxhp = ${hpChange}, currmp = ${currMPChange},
            maxmp = ${mpChange}, huntmod = ${huntChange}, gathermod = ${gatherChange},
            fishmod = ${fishChange}
          WHERE
            playerid = '${message.author.id}'`)
        return message.answer(message.author, `You have equipped ${putOn.name}`);
      }
      catch (e) {
        message.channel.send('There was an error changing your equipment.  Please report this in my server.');
        this.client.channels.get('547399254864560138').send(`There was an error in the wear command. ${e.message}
        ${e.stack}`)
      }
    }
    else return message.channel.send('You don\'t have that!');
  }
}

module.exports = WearCommand;