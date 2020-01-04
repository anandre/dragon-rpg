const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const promptTest = async (combat, message) => {
  // const pAttacks = [];
  const attackers = [];
  const regTest = /<@!?(\d+)>/;
  const filter = m => {
    const args = m.content.toLowerCase().trim().split(/ +/g);
    const fighter = combat.find(f => f.id === m.author.id);
    return !attackers.includes(m.author.id)
    && combat.filter(f => f.side === 'player' && f.currHP > 0).map(f => f.id).includes(m.author.id)
    &&
    (
      (
        ['attack', 'a', 'att'].includes(args[0])
        && (args[1].match(regTest) ? combat.map(f => f.id).indexOf(args[1].match(regTest)[1] !== -1) : combat.map(f => f.id).indexOf(args[1]) !== -1)
      )
    ||
      (
        ['cast', 'c', 'use'].includes(args[0])
        && fighter.abilities.some(a => a.name === args[1])
        && fighter.abilities.find(a => a.name === args[1]).cooldown === dataManager.abilities.get(args[1]).cooldown
        && fighter.currMP >= dataManager.abilities.get(args[1]).mana
        && (args[2].match(regTest) ? combat.map(f => f.id).indexOf(args[2].match(regTest)[1]) !== -1 : combat.map(f => f.id).indexOf(args[2]) !== -1)
      )
    );
  };
  const collector = message.channel.createMessageCollector(filter, { max: combat.filter(f => f.side === 'player' && f.currHP > 0).length });
  const result = new Promise(resolve => {
    collector.on('collect', msg => {
      attackers.push(msg.author.id);
      msg.react('✅');
    });
    collector.on('end', collected => {
      for (const [, item] of collected) {
        const choice = item.content.toLowerCase().trim().split(/ +/g);
        if (['attack', 'a', 'att'].includes(choice[0])) {
          combat.find(f => f.id === item.author.id).choice = `${item.author.id} ${choice.slice(0, 3).join(' ')}`.split(' ');
          // pAttacks.push(`${item.author.id} ${choice.slice(0, 3).join(' ')}`.split(' '));
        }
        else if (['cast', 'c', 'use'].includes(choice[0])) {
          combat.find(f => f.id === item.author.id).choice = `${item.author.id} ${choice.slice(0, 3).join(' ')}`.split(' ');
          // pAttacks.push(`${item.author.id} ${choice.slice(0, 3).join(' ')}`.split(' '));
        }
      }
      for (const enemy of combat.filter(e => e.side === 'monster' && e.currHP > 0)) {
        const choice = {
          cAggressive: dataManager.functions.aggressiveEnemy(enemy, combat),
          cMage: dataManager.functions.mageEnemy(enemy, combat),
          cAggressiveLeastHP: dataManager.functions.aggEnemyLeastHP(enemy, combat)
        };
        enemy.choice = choice[enemy.ai];
        // pAttacks.push(choice[enemy.ai]);
      }
      const res = [];
      for (const combatant of combat.filter(f => f.currHP > 0).sort((a, b) => b.init - a.init)) {
        const attack = combatant.choice;
        if (['attack', 'a', 'att'].includes(attack[1])) {
          const attacker = combat.find(a => a.id === attack[0]);
          const defender = combat.find(a => a.id === (attack[2].match(regTest) ? attack[2].match(regTest)[1] : attack[2]));
          const action = attacker.weapon.attack({ attacker: attacker, defender: defender });
          res.push(action);
        }
        else if (['cast', 'c', 'use'].includes(attack[1])) {
          const attacker = combat.find(a => a.id === attack[0]);
          const ability = dataManager.abilities.find(a => a.name === attack[2]);
          const defender = combat.find(a => a.id === (attack[3].match(regTest) ? attack[3].match(regTest)[1] : attack[3]));
          const action = ability.cast({ attacker: attacker, defender: defender, combat: combat });
          res.push(action);
        }
      }
      return resolve(res);
    });
  });
  return result;
};

module.exports = promptTest;