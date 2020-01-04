const baseDmg = (range, damage, damageStat, scale) => {
  return Math.floor((Number.parseFloat((Math.random() * range).toFixed(2))) * damage) + 1 + Math.max(Math.floor(damageStat * scale, 1));
};

module.exports = baseDmg;