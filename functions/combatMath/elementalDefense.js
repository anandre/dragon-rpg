const elementalDefense = (defender, element) => {
  const elementalMods = [
    {
      element: 'fire',
      barfire: 1.5,
      anifire: 1.75
    }
  ];

  const ele = elementalMods.find(e => e.element === element);

  const elementalDefenseMulti = defender.statuses.filter(a => Object.keys(ele).includes(a.name))
    .map(s => ele[s.name])
    .reduce((a, b) => a * b, 1);

  return elementalDefenseMulti;
};

module.exports = elementalDefense;