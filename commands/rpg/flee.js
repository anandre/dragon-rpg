const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class FleeCommand extends Command {
  constructor() {
    super('flee', {
      aliases: ['flee', 'run'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Attempt to flee from an enemy.  Only usable in single combat.  A character with a higher Agility has a better chance to flee.',
        usage: 'flee',
        example: 'flee'
      }
    })
  }

  async exec(message) {
    if (!this.client.combat.has(message.author.id)) {
      return message.answer(message.author.username, 'you are not in combat.');
    }
    const player = this.client.combat.get(message.author.id);
    const enemy = this.client.enemyInfo.get(player.enemyid);
    const run = this.client.flee(player, enemy);
    if (run) {
      await this.client.db.query(`
        UPDATE
          players
        SET
          currhp = LEAST(maxhp, ${player.currhp}),
          currmp = LEAST(maxmp, ${player.currmp})
        WHERE
          playerid = '${message.author.id}'`);
      this.client.combat.delete(message.author.id);
      await this.client.db.query(`
        DELETE FROM
          combat
        WHERE
          playerid = $1`,
        [message.author.id]);
      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
        .setDescription(stripIndents`${message.author.username} successfully ran away!`)
      return message.channel.send(embed);
    }
    else {
      const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
      if (player.currhp > 0) { //player survived, increment turn
        return await this.client.fleeIncrementTurn(player, enemy, message, enemyDmg);
      }
      else { //enemy defeats player
        return await this.client.fleePlayerDefeat(player, enemy, message, enemyDmg);
      }
    }
  }
}

module.exports = FleeCommand;