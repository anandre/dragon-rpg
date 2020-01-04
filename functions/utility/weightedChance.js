const weightedChance = (choices, weights) => {
  const sum = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  weights = weights.map(f => (acc = f + acc));
  const rand = Math.random() * sum;
  return choices[weights.filter(el => el <= rand).length];
};

module.exports = weightedChance;