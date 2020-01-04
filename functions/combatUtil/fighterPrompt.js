const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const fighterPrompt = async (thisCombat, message) => {
  const pAttacks = [];
  const regTest = /<@!?(\d+)>/;
  for (const fighter of thisCombat) {
    if (fighter.side === 'player') {
      if (fighter.currHP > 0) {
        const cFilter = m => {
          const args = m.content.toLowerCase().trim().split(/ +/g);
          return m.author.id === fighter.id
          &&
          (
            (
              ['attack', 'a', 'att'].includes(args[0])
              && (args[1].match(regTest) ? thisCombat.map(f => f.id).indexOf(args[1].match(regTest)[1] !== -1) : thisCombat.map(f => f.id).indexOf(args[1]) !== -1)
            )
          ||
            (
              ['cast', 'c', 'use'].includes(args[0])
              && fighter.abilities.some(a => a.name === args[1])
              && fighter.abilities.find(a => a.name === args[1]).cooldown === dataManager.abilities.get(args[1]).cooldown
              && fighter.currMP >= dataManager.abilities.get(args[1]).mana
              && (args[2].match(regTest) ? thisCombat.map(f => f.id).indexOf(args[2].match(regTest)[1]) !== -1 : thisCombat.map(f => f.id).indexOf(args[2]) !== -1)
            )
          );
        };
        pAttacks.push(message.channel.awaitMessages(cFilter, { max: 1 }));
      }
    }
    else if (fighter.currHP > 0) {
      const players = thisCombat.filter(f => f.side === 'player');
      const targ = players[Math.floor(Math.random() * players.length)].id;
      pAttacks.push(Promise.resolve(`${fighter.id} attack ${targ}`));
    }
  }

  const round = await Promise.all(pAttacks);
  console.log(round);
  const roundAttacks = round.map(r => r.constructor.name === 'Collection' ? `${r.first().author.id} ${r.first().content.toLowerCase().trim().split(/ +/g).slice(0, 3).join(' ')}`.split(' ') : r.split(' '));
  // console.log(roundAttacks);
  const res = [];
  for (const choice of roundAttacks) {
    console.log(choice);
    if (['attack', 'a', 'att'].includes(choice[1])) {
      const attacker = thisCombat.find(a => a.id === choice[0]);
      console.log(choice[2].match(regTest));
      const defender = thisCombat.find(a => a.id === (choice[2].match(regTest) ? choice[2].match(regTest)[1] : choice[2]));
      // console.log(defender.name, defender.id);
      const action = attacker.weapon.attack(attacker, defender);
      res.push(action);
    }
    else if (['cast', 'c', 'use'].includes(choice[1])) {
      const attacker = thisCombat.find(a => a.id === choice[0]);
      const ability = dataManager.abilities.find(a => a.name === choice[2]);
      const defender = thisCombat.find(a => a.id === (choice[3].match(regTest) ? choice[3].match(regTest)[1] : choice[3]));
      const action = ability.cast(attacker, defender);
      res.push(action);
    }
  }
  return res;
};

module.exports = fighterPrompt;