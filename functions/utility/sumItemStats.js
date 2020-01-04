const sumItemStats = (...objects) => {
  const res = {};
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'number') {
        if (res[key]) res[key] += value;
        else res[key] = value;
      }
    }
  }
  return res;
};

module.exports = sumItemStats;