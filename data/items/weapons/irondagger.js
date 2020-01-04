const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Weapon = require(join(appDir, '/data/classes/weapon.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class IronDagger extends Weapon {
  constructor(data = {
    id: 'idagg',
    name: 'iron dagger',
    slot: 'weapon',
    damage: 3,
    damagestat: 'str',
    damagetype: 'physical',
    acc: 3,
    prec: 3,
    focus: 0,
    str: 1,
    agi: 1,
    con: 0,
    mag: 0,
    spr: 0,
    hp: 0,
    mp: 0,
    gathertimer: 1,
    fishtimer: 1,
    hunttimer: 1,
    source: 'shop',
    cost: 25,
    sell: 5,
    rarity: 3
  }) {
    super(data);

    this.description = 'A basic blade, unadorned but effective.';
    this.abilities = [];
  }

  attack({
    baseDamage = 1.9,
    scale = 0.33
  } = {}) {

  }

/*  attack({
    attacker = undefined,
    defender = undefined,
    baseDamage = 1.9,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.33,
    element = null
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
    return `${aName} attacked ${dName} and did ${netDmg} ${element ? element : ''} damage!`;
  } */
}

module.exports = IronDagger;