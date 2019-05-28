const { Command } = require('discord-akairo');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');

class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test', 't'],
      ownerOnly: true
    })
  }

  async *args(message, parsed, state) {
    let players = yield {
      type: 'users'
    }
    if (!players) players = new Collection();
    players.set(message.author.id, message.author);

    return { players };
  }

  async exec(message, { players }) {
    if (!this.client.players.some(r => players.has(r))) {
      return message.answer(message.author, 'one or more of the users is not playing.')
    }
    //add check for if a mentioned player is already in combat
    await message.channel.send('All players need to respond with \`ready\` to start combat, or \`cancel\` to stop combat now.');
    let promises = [];
    for (const [id, user] of players) {
      const filter = m => m.author.id === id && ['cancel', 'ready'].includes(m.content.toLowerCase());
      promises.push(message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(msg => {
        if (msg.first().content.toLowerCase() === 'cancel') return Promise.reject(new Error('Combat has been canceled.'));
      }));
    }
    try {
      await Promise.all(promises);
      this.client.combat.set(players.keyArray().join('-'), []);
      const thisCombat = this.client.combat.get(players.keyArray().join('-'));
      const playerStats = (await this.client.db.query(`SELECT
          playerid, path, str, agi, con, mag, spr,
          currhp, maxhp, currmp, maxmp, level,
          weaponid, armorid, physdef, magdef
        FROM
          players
        WHERE
          playerid IN ('${players.keyArray().join('\', \'')}')`)).rows;
      for (const fighter of playerStats) {
        fighter.name = this.client.users.get(fighter.playerid).username;
        const weaponAbilities = this.client.infoItems.get(fighter.weaponid).abilities;
        const armorAbilities = this.client.infoItems.get(fighter.armorid).abilities;
        const totalAbis = weaponAbilities.concat(armorAbilities);
        const abiInfo = [];
        for (let i = 0; i < totalAbis.length; i++) {
          abiInfo.push({ name: totalAbis[i], cooldown: this.client.abilities.get(totalAbis[i].cooldown)})
        }
        fighter.abilities = abiInfo;
        fighter.statuses = [];
        fighter.side = 'player';
        thisCombat.push(fighter);
        const enemy = { ...this.client.enemyInfo.filter(e => e.rank <= fighter.level).random()};
        console.log(enemy);
        enemy.side = 'monster';
        enemy.currhp = enemy.hp;
        enemy.currmp = enemy.mp;
        enemy.maxhp = enemy.hp;
        enemy.maxmp = enemy.mp;
        enemy.target = `${enemy.id}${thisCombat.filter(e => e.name === enemy.name && e.side === 'monster').length + 1}`
        thisCombat.push(enemy);
      }
      for (const combatant of thisCombat) {
        combatant.init = Math.floor(Math.random() * 10) + (combatant.path === 'Rogue' ? combatant.agi + 2 : combatant.agi)
      }
      const initSorted = thisCombat.sort((a, b) => b.init - a.init);
      let initMessage = '';
      for (let i = 0; i < initSorted.length; i++) {
        initMessage += `${i + 1}. ${initSorted[i].name} ${initSorted[i].side === 'monster' ? '(target: ' + initSorted[i].target + ')' : ''} (init: ${initSorted[i].init})\n`
      }

      await message.channel.send(stripIndents`Everyone is ready for combat!
      
      ${initMessage}`);

      let pAttacks = [];
      for (const fighter of thisCombat) {
        if (fighter.side === 'player') {
          if (fighter.currhp > 0) {
            const cFilter = m => {
              const commandArgs = m.content.toLowerCase().trim().split(/ +/g);
              return m.author.id === fighter.playerid && ['attack'].includes(commandArgs[0])
            }
            pAttacks.push(message.channel.awaitMessages(cFilter, { max: 1 }))
          }
        }
        else {
          if (fighter.currhp > 0) {
            const players = thisCombat.filter(f => f.side === 'player');
            const targ = players[Math.floor(Math.random() * players.length)].playerid
            pAttacks.push(Promise.resolve(`${fighter.target} attack ${targ}`));
          }
        }
      }
      const round = await Promise.all(pAttacks);
      console.log(round);
      const roundAttacks = round.map(r => r.constructor.name === 'Collection' ? `${r.first().author.id} ${r.first().content.split(' ').slice(0, 2).join(' ')}`.split(' ') : r.split(' '));
      console.log(roundAttacks);
    }
    catch (e) {
      message.channel.send(`${e.message}
      ${e.stack}`, { code: 'xxl' });
      return message.answer(message.author, 'your combat has been canceled.');
    }
  }
}

module.exports = TestCommand;