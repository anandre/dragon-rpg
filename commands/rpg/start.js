const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

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
    });
  }

  async *args(message) {
    const input = yield {
      type: ['warrior', 'priest', 'rogue', 'mage'],
      prompt: {
        start: 'Are you going to follow the path of the `Warrior`, `Priest`, `Rogue`, or `Mage`?  If you are unsure, you can say `cancel` to choose later.',
        retry: 'That is not a valid path!',
        timeout: 'If you need more time to think about your choice, please ask for more information.',
        cancel: 'If you need more time to think about your choice, please ask for more information.',
        retries: 2
      }
    };

    const pathData = require(join(appDir, `/data/paths/${input}.js`));
    const equipData = (require(join(appDir, `/data/${input}.json`)))[0];

    const path = new pathData({
      id: message.author.id,
      level: 1,
      xp: 0,
      gold: 0,
      weaponid: equipData.weaponid,
      armorid: equipData.armorid,
      accessoryid: equipData.accessoryid,
    });
    console.log(path.weapon, path.armor, path.accessory);

    const color = {
      warrior: 'RED',
      rogue: 'BLUE',
      mage: 'BLACK',
      priest: 'WHITE'
    }[input];

    return { path, color };
  }

  async exec(message, { path, color }) {
    await db.query(`
      INSERT INTO 
        players (
          playerid, path, level, xp, gold, weaponid, armorid, accessoryid, currhp, currmp,
          hunttimer, fishtimer, gathertimer
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $11
      )
      ON CONFLICT
        (playerid)
      DO NOTHING`,
    [path.id, path.path, path.level, path.xp, path.gold, path.weapon.id, path.armor.id, path.accessory.id,
      path.maxHP, path.maxMP, Date.now() - 300000]);
    this.client.players.push(message.author.id);
    const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(`${message.author.username} has embarked upon the path of the ${path.path}.`, message.author.displayAvatarURL())
      .addField('\u200b', stripIndents`**HP**: ${path.maxHP}
        \u200b
        **STR**: ${path.str}
        **AGI**: ${path.agi}
        \u200b
        **Weapon**: ${path.weapon.name}`, true)
      .addField('\u200b', stripIndents`**MP**: ${path.maxMP}
        \u200b
        **CON**: ${path.con}
        \u200b
        \u200b
        **Armor**: ${path.armor.name}`, true)
      .addField('\u200b', stripIndents`\u200b
        \u200b
        **MAG**: ${path.mag}
        **SPR**: ${path.spr}
        \u200b
        **Accessory**: ${path.accessory.name}`, true);
    return message.channel.send(embed);
  }
}

module.exports = StartCommand;