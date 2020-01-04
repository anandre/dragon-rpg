const { Command } = require('discord-akairo');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class StartCombatCommand extends Command {
  constructor() {
    super('startcombat', {
      aliases: ['startcombat', 'scombat', 'sc'],
      channel: 'guild',
      category: 'rpg',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      description: {
        content: 'Start combat by yourself or with a group - larger groups have more and tougher enemies, but can also lead to greater glory!',
        usage: 'startcombat [user] [user] [user] [user]',
        example: stripIndents`startcombat
          startcombat @Mark#2320`
      }
    });
  }

  async *args(message) {
    let users = yield {
      type: 'users'
    };

    if (!users) users = new Collection();
    users.set(message.author.id, message.author);

    return { users };
  }

  async exec(message, { users }) {
    await dataManager.functions.readyCheck(message, users);

    const combat = dataManager.combat.get(users.keyArray().join('-'));
    const players = combat.filter(f => f.side === 'player');
    const enemies = combat.filter(f => f.side === 'monster');
    if (!combat) return;

    do {
      if (combat.find(t => t.constructor.name === 'Number') === 1) {
        const startInits = dataManager.functions.generateInit(combat);
        const startEmbed = dataManager.functions.combatEmbed(combat);
        let startInitMessage = '';
        for (const fighter of startInits.filter(i => i.init)) {
          startInitMessage += `**${dataManager.functions.displayName(fighter)}** Init**: ${fighter.init}\n`;
        }
        startEmbed.description += `\n${startInitMessage}`;
        await message.channel.send({ embed: startEmbed });
        const attacks = await dataManager.functions.promptTest(combat, message);
        const nextEmbed = dataManager.functions.incrementTurn(combat, attacks);
        await message.channel.send({ embed: nextEmbed });
      }
      else {
        // dataManager.functions.generateInit(combat);
        const attacks = await dataManager.functions.promptTest(combat, message);
        const nextEmbed = dataManager.functions.incrementTurn(combat, attacks);
        await message.channel.send({ embed: nextEmbed });
      }
    } while (!players.every(f => f.currHP <= 0) && !enemies.every(f => f.currHP <= 0));
    if (players.every(f => f.currHP <= 0)) {
      dataManager.combat.delete(users.keyArray().join('-'));
      return message.channel.send('players lose');
    }
    if (enemies.every(f => f.currHP <= 0)) {
      const xp = Math.round(enemies.map(f => f.xp).reduce((a, b) => a.xp + b.xp) / players.length);
      const gold = Math.round(enemies.map(f => f.gold).reduce((a, b) => a + b) / players.length);
      const items = await dataManager.functions.itemDrop(combat);
      console.log(xp);
      let str = `All players have received ${gold}g.\n`;
      for (const player of players) {
        const item = items.find(f => f.includes(player.name));
        const newXP = await dataManager.functions.addXPAndGold(player.id, xp, gold, player.currHP, player.currMP);
        if (newXP) {
          str += `${item}, and they gained ${xp} xp and is now level ${newXP}!\n`;
        }
        else {
          str += `${item}, and they gained ${xp} xp!\n`;
        }
      }
      dataManager.combat.delete(users.keyArray().join('-'));
      return message.channel.send(str);
    }
  }
}

module.exports = StartCombatCommand;