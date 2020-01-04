const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const mageEnemy = (enemy, combat) => {
  const choice = Math.random() * 100;
  const usable = enemy.abilities
    .filter(a => a.mana <= enemy.currHP && a.cooldoown === dataManager.abilities.get(a.name).cooldown);
  if (usable.length > 0 && choice > 30) {
    const ability = usable[Math.floor(Math.random() * usable.length)];
    const targets = combat.filter(f => f.side === (['offensive', 'debuff'].includes(ability.type) ? 'player' : 'monster'));
    const target = targets[Math.floor(Math.random() * targets.length)];
    return `${enemy.id} cast ${ability.name} ${target.id}`.split(' ');
  }
  else {
    const targets = combat.filter(f => f.side === 'player');
    const target = targets[Math.floor(Math.random() * targets.length)];
    return `${enemy.id} attack ${target.id}`.split(' ');
  }
};

module.exports = mageEnemy;