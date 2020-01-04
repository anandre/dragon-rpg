const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, 'data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class BashAbility extends Ability {
  constructor(data = {
    name: 'bash',
    cooldown: 4,
    mana: 5,
    description: 'A vicious blow designed to maim the intended target.',
    target: 'single',
    damage: 7,
    damagestat: 'str',
    damagetype: 'physical'
  }) {
    super(data);
  }

  cast({
    attacker = undefined,
    defender = undefined,
    baseDamage = 1.75,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.7
  } = {}) {
    if (attacker.currHP <= 0) return;
    const aName = dataManager.functions.displayName(attacker);
    const dName = dataManager.functions.displayName(defender);
    if (attacker.currMP < this.mana) {
      return `${aName} tried to use ${this.name} but did not have enough mana!`;
    }
    const baseDmg = dataManager.functions.baseDmg(baseDamage, dmg, stat, scale);
    const statusMulti = dataManager.functions.statusDmg(attacker);
    const rawDmg = Math.round(baseDmg * statusMulti);
    const defense = dataManager.functions.statusDefense(defender).physDef;
    const netDmg = Math.max(rawDmg - defense, 0);
    dataManager.functions.loseHP(defender, netDmg);
    dataManager.functions.abilityUsed(attacker, this.name, this.mana);
    return `${aName} used ${this.name} against ${dName} and did ${netDmg} damage!`;
  }
}

module.exports = BashAbility;