const statusDefense = (defender) => {
  const physDefenseMods = {
    toughen: 1.25
  };

  const magDefenseMods = {
    barrier: 1.5
  };

  const physDefenseMulti = defender.statuses.filter(a => Object.keys(physDefenseMods).includes(a.name))
    .map(s => physDefenseMods[s.name])
    .reduce((a, b) => a * b, 1);

  const magDefenseMulti = defender.statuses.filter(a => Object.keys(magDefenseMods).includes(a.name))
    .map(s => magDefenseMods[s.name])
    .reduce((a, b) => a * b, 1);

  return {
    physDef: physDefenseMulti,
    magDef: magDefenseMulti
  };
};

module.exports = statusDefense;