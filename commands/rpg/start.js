const { Command } = require('discord-akairo');

class StartCommand extends Command {
  constructor() {
    super('start', {
      aliases: ['start', 'register'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Choose your starting path.  Respond to the prompt with your choice.',
        usage: 'start -> respond to prompt',
        example: 'start -> Warrior' 
      }    
    })
  }

  async *args(message, parsed, state) {
    const input = yield {
      type: ['Warrior', 'Priest', 'Rogue', 'Mage'],
      prompt: {
        start: 'Are you going to follow the path of the `Warrior`, `Priest`, `Rogue`, or `Mage`?  If you are unsure, you can say \`cancel\` to choose later.',
        retry: 'That is not a valid path!',
        timeout: 'If you need more time to think about your choice, please ask for more information.',
        cancel: 'If you need more time to think about your choice, please ask for more information.',
        retries: 2
      }
    }

    const paths = {
      'Warrior': this.client.warrior,
      'Priest': this.client.priest,
      'Rogue': this.client.rogue,
      'Mage': this.client.mage
    }

    const path = paths[input];

    const weapon = this.client.infoItems.get(path.weapon);
    const armor = this.client.infoItems.get(path.armor);
    const strmod = weapon.strmod + armor.strmod;
    const agimod = weapon.agimod + armor.agimod;
    const conmod = weapon.conmod + armor.conmod;
    const magmod = weapon.magmod + armor.magmod;
    const sprmod = weapon.sprmod + armor.sprmod;
    const hpmod = weapon.hpmod + armor.mpmod;
    const mpmod = weapon.mpmod + armor.mpmod;

    return { path, strmod, agimod, conmod, magmod, sprmod, hpmod, mpmod };
  }

  async exec(message, { path, strmod, agimod, conmod, magmod, sprmod, hpmod, mpmod }) {
    await this.client.db.query(`
      INSERT INTO
        players (
      playerid, path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp,
      hunttimer, gathertimer, fishtimer, armorid, weaponid, accessoryid,
      gold, huntmod, fishmod, gathermod, physdef, magdef)
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10,
        $11, $11, $12, $12, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21)
      ON CONFLICT (playerid) DO NOTHING`,
      [message.author.id, path.name, 0, 1, path.str + strmod,
      path.agi + agimod , path.con + conmod, path.mag + magmod,
      path.spr + sprmod, path.hpmod + hpmod, path.mpmod + mpmod,
      message.createdTimestamp - 1800000, path.armor, path.weapon,
      path.accessory, 50, 1, 1, 1, 2, 1]);
    this.client.players.push(message.author.id);
    return message.channel.send(`You have chosen to follow the path of the ${path.name}.`)
  }
}

module.exports = StartCommand;