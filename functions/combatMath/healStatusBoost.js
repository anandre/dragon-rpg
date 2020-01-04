const healStatusBoost = (caster) => {
  const healMods = {
    prayerful: 1.25
  };
  const healMulti = caster.statuses.filter(a => Object.keys(healMods).includes(a.name))
    .map(s => healMods[s])
    .reduce((a, b) => a * b, 1);

  return healMulti;
};

module.exports = healStatusBoost;