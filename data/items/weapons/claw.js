const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Weapon = require(join(appDir, '/data/classes/weapon.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Claw extends Weapon {
  constructor(data = {
    id: 'claw',
    name: 'claw',
    slot: 'weapon',
    damage: 2,
    damagestat: 'agi',
    damagetype: 'physical',
    acc: 2,
    prec: 5,
    str: 1,
    agi: 2,
    source: 'enemy',
    cost: 0,
    sell: 0,
    rarity: 0
  }) {
    super(data);

    this.description = 'Short or long, they\'re always sharp.';
    this.abilities = [];
  }

  attack({
    attacker = undefined,
    defender = undefined,
    baseDamage = 1.6,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.33,
    element = 'neutral'

  } = {}) {
    if (attacker.currHP === 0) return;
    const aName = dataManager.functions.displayName(attacker);
    const dName = dataManager.functions.displayName(defender);
    const toHit = dataManager.functions.hitCheck(attacker, defender);
    if (!toHit) {
      return `${aName} attacked ${dName} but \`missed\``;
    }
    const crit = dataManager.functions.critCheck(attacker, toHit);
    const baseDmg = dataManager.functions.baseDmg(baseDamage, dmg, stat, scale);
    const statusMulti = dataManager.functions.statusDmg(attacker);
    let rawDmg = Math.round(baseDmg * statusMulti * crit);
    let defense = dataManager.functions.statusDefense(defender).physDef;
    if (element !== 'neutral') {
      const elementalMulti = dataManager.functions.elementalDmg(attacker, element);
      rawDmg = Math.round(rawDmg * elementalMulti);
      const elementalDef = dataManager.functions.elementalDefense(defender, element);
      defense = Math.round(defense * elementalDef);
    }
    const netDmg = Math.max(rawDmg - defense, 0);
    dataManager.functions.loseHP(defender, netDmg);
    return `${aName} attacked ${dName} and did ${netDmg} ${element === 'neutral' ? '' : element} damage!`;
  }
}

module.exports = Claw;