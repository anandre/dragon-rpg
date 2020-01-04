const critCheck = (attacker, hit) => {
  return hit < attacker.prec ? attacker.fero : 1;
};

module.exports = critCheck;