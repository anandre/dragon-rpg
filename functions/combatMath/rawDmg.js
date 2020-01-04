const rawDmg = (baseDmg, statusMultiplier, elementalMultiplier) => {
  return Math.round(baseDmg * statusMultiplier * elementalMultiplier);
};

module.exports = rawDmg;