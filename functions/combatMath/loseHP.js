const loseHP = (target, loss) => {
  return target.currHP = Math.max(0, target.currHP -= loss);
};

module.exports = loseHP;