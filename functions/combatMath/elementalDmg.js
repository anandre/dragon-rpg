const elementalDmg = (attacker, element) => {
  const elementalMods = [
    {
      element: 'fire',
      enfire: 1.5,
      matifire: 2
    }
  ];
  const ele = elementalMods.find(e => e.element === element);

  const elementalMulti = attacker.statuses.filter(a => Object.keys(ele).includes(a.name))
    .map(s => ele[s.name])
    .reduce((a, b) => a * b, 1);

  return elementalMulti;
};

module.exports = elementalDmg;