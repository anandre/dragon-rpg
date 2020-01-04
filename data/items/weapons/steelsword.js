const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Weapon = require(join(appDir, '/data/classes/weapon.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class SteelSword extends Weapon {
  constructor(data = {
    id: 'ssword',
    name: 'steel sword',
    slot: 'weapon',
    damage: 3,
    damagestat: 'str',
    damagetype: 'physical',
    acc: 7,
    prec: 3,
    focus: 0,
    str: 4,
    agi: 1,
    con: 1,
    mag: 0,
    spr: 0,
    hp: 10,
    mp: 0,
    gathertimer: 1,
    fishtimer: 1,
    hunttimer: 1,
    source: 'shop',
    cost: 250,
    sell: 50,
    rarity: 4
  }) {
    super(data);

    this.description = 'A run-of-the-mill short sword.';
    this.abilities = [];
  }

  attack({
    attacker = undefined,
    defender = undefined,
    baseDamage = 2.5,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.5,
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
  }
}

module.exports = SteelSword;