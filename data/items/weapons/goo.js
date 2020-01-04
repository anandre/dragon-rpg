const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Weapon = require(join(appDir, '/data/classes/weapon.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Goo extends Weapon {
  constructor(data = {
    id: 'goo',
    name: 'goo',
    slot: 'weapon',
    damage: 4,
    damagestat: 'mag',
    damagetype: 'magical',
    acc: 0,
    prec: 0,
    focus: 3,
    tough: 0,
    mind: 1,
    str: 0,
    agi: 0,
    con: 0,
    mag: 2,
    spr: 1,
    hp: 0,
    mp: 5,
    source: 'enemy',
    cost: 0,
    sell: 0,
    rarity: 0
  }) {
    super(data);

    this.description = 'Slimy, icky, and just plain gross.';
    this.abilities = [];
  }

  attack({
    attacker = undefined,
    defender = undefined,
    baseDamage = 1.5,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.5,
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

module.exports = Goo;
