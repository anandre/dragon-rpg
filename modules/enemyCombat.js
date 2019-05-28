module.exports = (client) => {

  client.enemyBasicAttack = (enemy, player) => {
    const enemyDmgDice = enemy.damage.split(' + ')[0].split('d');
    const enemyDmgAdd = enemy.damage.split( ' + ')[1].split(' * ');

    const enemyObject = {
      n: 0,
      p: player.physdef,
      m: player.magdef,
      STR: enemy.str,
      AGI: enemy.agi,
      MAG: enemy.mag,
      SPR: enemy.spr
    };

    let rawDmg = 0;
    let i = 0;
    while (i < parseInt(enemyDmgDice[0])) {
      i++;
      rawDmg += Math.floor(Math.random() * parseInt(enemyDmgDice[1]));
    };
    const addDmg = Math.floor(parseFloat(enemyDmgAdd[0]) * enemyObject[enemyDmgAdd[1]]);
    const enemyRawDmg = rawDmg + addDmg;
    const enemyNetDmg = enemyRawDmg - enemyObject[enemy.damagetype];
    player.currhp -= Math.max(1, enemyNetDmg);
    return Math.max(1, enemyNetDmg);
};

client.enemyCastSingleHeal = (enemy, player, ability) => {
  const dmgDice = ability.damage.split(' + ')[0];
  const dmgAdd = ability.damage.split(' + ')[1];

  let rawDmg = 0;
  let i = 0;
  while (i < parseInt(dmgDice[0])) {
    i++;
    rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
  };
  const addDmg = Math.floor(parseFloat(dmgAdd[0]) * type[dmgAdd[1]]);
  const grossDmg = rawDmg + addDmg;
  const enemySrc = client.enemyInfo.get(enemy.enemyid);
  player.enemyhp = Math.min(enemySrc.hp, enemyhp += grossDmg);
  player.enemymp -= ability.mana;
  player.enemycd[enemy.abilities.indexOf(ability.name)] -= 1;
  return grossDmg;
}

  client.enemyCastSingleDamage = (enemy, player, ability) => {
    const dmgDice = ability.damage.split(' + ')[0];
    const dmgAdd = ability.damage.split(' + ')[1];
    const type = {
      n: 0,
      p: enemy.physdef,
      m: enemy.magdef,
      STR: player.str,
      AGI: player.agi,
      MAG: player.mag,
      SPR: player.spr
    };

    let rawDmg = 0;
    let i = 0;
    while (i < parseInt(dmgDice[0])) {
        i++;
        rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
    };
    const addDmg = Math.floor(parseFloat(dmgAdd[0]) * type[dmgAdd[1]]);
    const grossDmg = rawDmg + addDmg;
    const netDmg = Math.max(1, grossDmg - type[ability.damagetype]);
    player.currhp -= netDmg;
    player.enemymp -= ability.mana;
    player.enemycd[enemy.abilities.indexOf(ability.name)] -= 1;
    return netDmg;
  }

  client.enemyAI = (enemy, player) => {
    const choice = Math.random();
    if (enemy.rarity === 'c') {
      if (choice > .8) {
        let eAbilities = enemy.abilities;
        for (let i = 0; i < eAbilities.length; i++) {
          if (client.abilities.get(eAbilities[i]).cooldown !== player.enemycd[i]) {
            eAbilities.splice(eAbilities[i], 1);
          }
        }
        const abi = client.abilities.find(a => a.name === eAbilities[Math.floor(Math.random() * eAbilities.length)]);
        if (abi.type === 'd' && abi.target === 's') return await client.enemyCastSingleDamage(enemy, player, abi);
      }
    }
  } 
}