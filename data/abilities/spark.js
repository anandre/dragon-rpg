const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, '/data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class SparkAbility extends Ability {
  constructor(data = {
    name: 'spark',
    cooldown: 3,
    mana: 4,
    damage: 7,
    damagestat: 'mag',
    damagetype: 'magical',
    element: 'lightning',
    target: 'single',
    description: 'A quick discharge that may disorient the target.'
  }) {
    super(data);
  }

  cast({
    attacker = undefined,
    defender = undefined,
    baseDamage = 2.75,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.9,
    element = this.element
  } = {}) {
    if (attacker.currHP <= 0) return;
    const aName = dataManager.functions.displayName(attacker);
    const dName = dataManager.functions.displayName(defender);
    if (attacker.currMP < this.mana) {
      return `${aName} tried to cast ${this.name} but did not have enough mana.`;
    }
    const baseDmg = dataManager.functions.baseDmg(baseDamage, dmg, stat, scale);
    const statusMulti = dataManager.functions.statusDmg(attacker);
    const elementalMulti = dataManager.functions.elementalDmg(attacker, element);
    const rawDmg = Math.round(baseDmg * statusMulti * elementalMulti);
    const baseDefense = dataManager.functions.statusDefense(defender).magDef;
    const elementalDef = dataManager.functions.elementalDefense(defender, element);
    const totalDef = Math.round(baseDefense * elementalDef);
    const netDmg = Math.max(rawDmg - totalDef, 0);
    dataManager.functions.loseHP(defender, netDmg);
    dataManager.functions.abilityUsed(attacker, this.name, this.mana);
    return `${aName} cast ${this.name} against ${dName} and dealt ${netDmg} ${element} damage.`;
  }
}

module.exports = SparkAbility;