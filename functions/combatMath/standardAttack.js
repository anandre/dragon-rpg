const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const standardAttack = ({
  attacker = undefined,
  defender = undefined,
  baseDamage = 1.9,
  dmg = 3,
  stat = 'str',
  scale = 0.33,
  element = null
} = {}) => {
  const aName = dataManager.functions.displayName(attacker);
  const dName = dataManager.functions.displayName(defender);
  const toHit = dataManager.functions.hitCheck(attacker, defender);
  if (!toHit) {
    return `${aName} attacked ${dName} but \`missed\`.`;
  }
  const crit = dataManager.functions.critCheck(attacker, toHit);
  const baseDmg = dataManager.functions.baseDmg(baseDamage, dmg, stat, scale);
  const statusMulti = dataManager.functions.statusDmg(attacker);
  let rawDmg = Math.round(baseDmg * statusMulti * crit);
  let defense = dataManager.functions.statusDefense(defender).physDef;
  if (element !== null) {
    const elementalMulti = dataManager.functions.elementalDmg(attacker, element);
    rawDmg = Math.round(rawDmg * elementalMulti);
    const elementalDef = dataManager.functions.elementalDefense(defender, element);
    defense = Math.round(defense * elementalDef);
  }
  const netDmg = Math.max(rawDmg - defense, 0);
  dataManager.functions.loseHP(defender, netDmg);
  return `${aName} attacked ${dName} and did \`${netDmg}\` ${element ? element : ''} damage!`;
};

module.exports = standardAttack;