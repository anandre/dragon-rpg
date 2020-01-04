const abilityUsed = (user, abilityName, abilityMana) => {
  user.abilities.find(a => a.name === abilityName).cooldown -= 1;
  user.currMP -= abilityMana;
};

module.exports = abilityUsed;