const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Weapon {
  constructor(data) {
    if (new.target === 'Weapon') {
      throw new TypeError('Cannot instantiate a Weapon class directly.');
    }

    this.id = data.id;
    this.name = data.name;

    this.damage = data.damage;
    this.damagestat = data.damagestat;
    this.damagetype = data.damagetype;
    this.element = data.element ? data.element : null;

    this.acc = data.acc ? data.acc : 0;
    this.prec = data.prec ? data.prec : 0;
    this.focus = data.focus ? data.focu : 0;

    this.tough = data.tough ? data.tough : 0;
    this.mind = data.mind ? data.mind : 0;
    this.dodge = data.dodge ? data.dodge : 0;
    this.resist = data.resist ? data.resist : 0;

    this.str = data.str ? data.str : 0;
    this.agi = data.agi ? data.agi : 0;
    this.con = data.con ? data.con : 0;
    this.mag = data.mag ? data.mag : 0;
    this.spr = data.spr ? data.spr : 0;
    this.hp = data.hp ? data.hp : 0;
    this.mp = data.mp ? data.mp : 0;
    this.hunttimer = data.hunttimer ? data.hunttimer : 1;
    this.gathertimer = data.gathertimer ? data.gathertimer : 1;
    this.fishtimer = data.fishtimer ? data.fishtimer : 1;
    this.source = data.source;
    this.cost = data.cost;
    this.sell = data.sell;
    this.slot = data.slot;
    this.rarity = data.rarity;
  }

  attack({
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
  }
}

module.exports = Weapon;