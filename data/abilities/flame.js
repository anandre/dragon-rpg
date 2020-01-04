const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, '/data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class FlameAbility extends Ability {
  constructor(data = {
    name: 'flame',
    mana: 3,
    cooldown: 2,
    damage: 4,
    damagestat: 'mag',
    damagetype: 'magical',
    element: 'fire'
  }) {
    super(data);

    this.description = 'One of a novice\'s first spells, a small ball of fire is conjured and thrown to a target.';
  }

  cast({
    attacker = undefined,
    defender = undefined,
    baseDamage = 2,
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

module.exports = FlameAbility;