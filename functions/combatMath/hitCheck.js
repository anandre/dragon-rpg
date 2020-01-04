const hitCheck = (attacker, defender) => {
  const hit = Math.random() * 100;
  const toMiss = 80 + attacker.acc - defender.dodge;
  return hit < toMiss ? hit : false;
};

module.exports = hitCheck;