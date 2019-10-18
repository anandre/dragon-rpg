const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class AttackCommand extends Command {
  constructor() {
    super('attack', {
      aliases: ['attack'],
      args: [
        {
          id: 'target',
          type: 'number',
          default: 1
        }
      ]
    })
  }

  async exec(message, { target }) {
    if (!this.client.combat.has(message.author.id)) { //start new combat
      const scombat = this.client.commandHandler.modules.get('startcombat');
      return await this.client.commandHandler.runCommand(message, scombat);
    }
    const player = this.client.combat.get(message.author.id);
    const enemy = this.client.enemies.get(player.enemyid);
    const weapon = this.client.items.get(player.weaponid);
    const inits = this.client.generateInit(player, enemy);

    if (inits.playerInit >= inits.enemyInit) { //player goes first
      const pDmg = this.client.playerBasicAttack(player, weapon, enemy);
      if (player.enemyhp > 0) { //enemy survives, counterattacks
        const eDmg = this.client.enemyBasicAttack(enemy, player);
        if (player.currHP > 0) { //player survives, increment turn
          return await this.client.incrementTurn(player, enemy, message, pDmg, eDmg);
        }
        else { //player dies
          return await this.client.playerDefeat(player, enemy, message, pDmg, eDmg);
        }
      }
      else { //enemy dies
        return await this.client.playerWin(player, enemy, message, pDmg);
      }
    }
    else { //enemy goes first
      const eDmg = this.client.enemyBasicAttack(enemy, player);
      if (player.currHP > 0) { //player survives, counterattacks
        const pDmg = this.client.playerBasicAttack(player, weapon, enemy);
        if (player.enemyhp > 0) { //enemy survives, increment turn
          return await this.client.incrementTurn(player, enemy, message, pDmg, eDmg);
        }
        else { // enemy dies
          return await this.client.playerWin(player, enemy, message, pDmg, eDmg);
        }
      }
      else { //player dies
        const pDmg = 0;
        return await this.client.playerDefeat(player, enemy, message, pDmg, eDmg);
      }
    }
  }
}

//module.exports = AttackCommand;