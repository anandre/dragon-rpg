const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const Warrior = require('../data/paths/warrior.js');

class TesterCommand extends Command {
  constructor() {
    super('tester', {
      aliases: ['tester'],
      ownerOnly: true
    })
  }

  async exec(message) {
    const player = (await this.client.db.query(`
      SELECT
        *
      FROM
        players
      WHERE
        playerid = $1`,
      [message.author.id])).rows[0];

    const playerData = new Warrior(this.client, {
      name: message.author.username,
      weaponid: player.weaponid,
      armorid: player.armorid,
      accessoryid: player.accessoryid,
      level: player.level,
      xp: player.xp,
      gold: player.gold,
      currHP: player.currHP,
      currMP: player.currMP
    });
    message.channel.send(stripIndents`Weapon: ${playerData.weapon.str}
    Armor: ${playerData.armor.str}
    Accessory: ${playerData.accessory.str}`)
    message.channel.send(playerData.str);
    const enemy = this.client.enemies.get('bandit');
    const attack = this.client.attack(playerData, enemy, playerData.statuses, enemy.statuses);
    const enemyAttack = this.client.attack(enemy, playerData, enemy.statuses, playerData.statuses);
    //message.channel.send(stripIndents`${attack}
    //${enemyAttack}`);
  }
}

module.exports = TesterCommand;