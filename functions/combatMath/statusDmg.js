const statusDmg = (attacker) => {
  const attackMods = {
    berserk: 1.5,
    weak: 0.5
  };
  const attackMulti = attacker.statuses.filter(a => Object.keys(attackMods).includes(a.name))
    .map(s => attackMods[s])
    .reduce((a, b) => a * b, 1);

  return attackMulti;
};

module.exports = statusDmg;