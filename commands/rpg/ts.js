const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class TestStartCommand extends Command {
  constructor() {
    super('tstart', {
      aliases: ['tstart', 'ts'],
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
      type: ['warrior', 'priest', 'rogue', 'mage'],
      prompt: {
        start: 'Are you going to follow the path of the `Warrior`, `Priest`, `Rogue`, or `Mage`?  If you are unsure, you can say \`cancel\` to choose later.',
        retry: 'That is not a valid path!',
        timeout: 'If you need more time to think about your choice, please ask for more information.',
        cancel: 'If you need more time to think about your choice, please ask for more information.',
        retries: 2
      }
    }

    const pathData = require(`../../data/paths/${input}.js`);
    const equipData = (require(`../../data/${input}.json`))[0];

    const path = new pathData(this.client, {
      id: message.author.id,
      level: 1,
      xp: 0,
      gold: 0,
      weaponid: equipData.weaponid,
      armorid: equipData.armorid,
      accessoryid: equipData.accessoryid,
    })
    //table: playerid, path, level, xp, gold, currHP, currMP, weaponid, armorid, accessoryid,
    //hunttimer, fishtimer, gathertimer
    //

    return { path };
  }

  async exec(message, { path }) {
    await this.client.db.query(`
      INSERT INTO 
        playertest (
          playerid, path, level, xp, gold, weaponid, armorid, accessoryid, currHP, currMP,
          hunttimer, fishtimer, gathertimer
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $11
        )
        ON CONFLICT
          (playerid)
        DO NOTHING`, [path.id, path.path, path.level, path.xp, path.gold, path.weaponid, path.armorid, path.accessoryid,
      path.currHP, path.currMP, Date.now() - 300000]);
    return message.channel.send(`You have chosen to follow the path of the ${path.path}. You have ${path.maxHP} max HP.`)
  }
}

module.exports = TestStartCommand;