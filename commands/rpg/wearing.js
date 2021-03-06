const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class WearingCommand extends Command {
  constructor() {
    super('wearing', {
      aliases: ['wearing', 'wring'],
      category: 'rpg',
      channel: 'guild',
      flags: ['--long'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      description: {
        content: 'Show current equipment for yourself or another player',
        usage: 'wearing [user] [--long]',
        example: 'wearing @Mark | 167988857046827010 | Mark#2320'
      },
    });
  }

  async *args() {
    const user = yield {
      type: 'user',
      default: message => message.author
    };

    const long = yield {
      match: 'flag',
      flag: '--long'
    };

    return { user, long };
  }

  async exec(message, { user, long }) {
    const wornItems = (await db.query(`
    SELECT
      weaponid, armorid, accessoryid
    FROM
      players
    WHERE
      playerid = $1`,
    [user.id])).rows[0];
    const weapon = dataManager.items.get(wornItems.weaponid);
    const armor = dataManager.items.get(wornItems.armorid);
    const accessory = dataManager.items.get(wornItems.accessoryid);
    const weaponAbilities = weapon.abilities.length === 0 ? 'none' : weapon.abilities.map(a => a.name).join(', ');
    const armorAbilities = armor.abilities.length === 0 ? 'none' : armor.abilities.map(a => a.name).join(', ');
    console.log(weaponAbilities);
    let weaponStr;
    let armorStr;
    let accessoryStr;
    if (long) {
      weaponStr = stripIndents`${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
        **Damage**: ${weapon.damage} (${weapon.damagetype})
        **Abilities**: ${weaponAbilities}
        **Strength:** ${weapon.str}
        **Agility:** ${weapon.agi}
        **Constitution**: ${weapon.con}
        **Magic:** ${weapon.mag}
        **Spirit:** ${weapon.spr}
        **HP:** ${weapon.hp}
        **MP**: ${weapon.mp}
        **Gather :** -${(1 - weapon.gathertimer) * 100}%
        **Fish :** -${(1 - weapon.fishtimer) * 100}%
        **Hunt :** -${(1 - weapon.hunttimer) * 100}%`;
      armorStr = stripIndents`${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
        **Toughness**: ${armor.tough}
        **Mind**: ${armor.mind}
        **Abilities**: ${armorAbilities}
        **Strength:** ${armor.str}
        **Agility:** ${armor.agi}
        **Constitution**: ${armor.con}
        **Magic:** ${armor.mag}
        **Spirit:** ${armor.spr}
        **HP:** ${armor.hp}
        **MP**: ${armor.mp}
        **Gather :** -${(1 - armor.gathertimer) * 100}%
        **Fish :** -${(1 - armor.fishtimer) * 100}%
        **Hunt :** -${(1 - armor.hunttimer) * 100}%`;
      accessoryStr = stripIndents`${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
        **Strength:** ${accessory.str}
        **Agility:** ${accessory.agi}
        **Constitution**: ${accessory.con}
        **Magic:** ${accessory.mag}
        **Spirit:** ${accessory.spr}
        **HP:** ${accessory.hp}
        **MP**: ${accessory.mp}
        **Gather :** -${(1 - accessory.gathertimer) * 100}%
        **Fish :** -${(1 - accessory.fishtimer) * 100}%
        **Hunt :** -${(1 - accessory.hunttimer) * 100}%`;
    }
    else {
      weaponStr = stripIndents`${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
        **Damage**: ${weapon.damage} (${weapon.damagetype})
        **Abilities**: ${weaponAbilities}`;
      armorStr = stripIndents`${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
        **Toughness**: ${armor.tough}
        **Mind**: ${armor.mind}
        **Abilities**: ${armorAbilities}`;
      accessoryStr = stripIndents`${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substring(1)).join(' ')}`;
    }
    console.log(weaponStr);
    const embed = new MessageEmbed()
      .setAuthor(user.username, user.displayAvatarURL())
      .setDescription(`${user.username}'s current items`)
      .addField('Weapon', weaponStr, true)
      .addField('Armor', armorStr, true)
      .addField('Accessory', accessoryStr, true)
      .setTimestamp();
    return await message.channel.send(embed);
  }
}

module.exports = WearingCommand;