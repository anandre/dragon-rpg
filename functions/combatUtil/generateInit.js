const generateInit = (combat) => {
  for (const combatant of combat) {
    combatant.init = Math.floor(Math.random() * 10) + combatant.agi + combatant.speed;
  }
  const initSorted = combat.sort((a, b) => b.init - a.init);
  return initSorted;
};

module.exports = generateInit;