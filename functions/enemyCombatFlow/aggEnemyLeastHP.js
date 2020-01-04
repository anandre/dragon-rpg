const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const aggEnemyLeastHP = (enemy, combat) => {
  const decision = Math.round(Math.random() * 100);
  const usable = enemy.abilities
    .filter(a => a.cooldown === dataManager.abilities.find(ab => ab.name === a.name).cooldown && a.mana <= enemy.currMP);
  const eTargets = combat.filter(f => f.side === 'player' && f.currHP > 0);

  if (usable.length > 0 && decision < 30) {
    const ability = usable[Math.floor(Math.random() * usable.length)];
    const target = eTargets.sort((a, b) => a.hp - b.hp)[0];
    return `${enemy.id} cast ${ability.name} ${target.id}`.split(' ');
  }
  else {
    const target = eTargets.sort((a, b) => a.hp - b.hp)[0];
    return `${enemy.id} attack ${target.id}`.split(' ');
  }
};

module.exports = aggEnemyLeastHP;