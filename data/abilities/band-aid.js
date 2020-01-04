const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, 'data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class BandageAbility extends Ability {
  constructor(data = {
    id: 'bandage',
    name: 'bandage',
    description: 'Heals small wounds.',
    mana: 3,
    cooldown: 3,
    damage: 4,
    damagestat: 'spr'
  }) {
    super(data);
  }

  cast({
    caster = undefined,
    target = undefined,
    baseHeal = 1.5,
    heal = this.damage,
    stat = this.damagestat,
    scale = 0.4
  } = {}) {
    if (caster.currHP <= 0) return;
    const aName = dataManager.functions.displayName(caster);
    const dName = dataManager.functions.displayName(target);
    if (caster.currMP < this.mana) {
      return `${aName} tried to use ${this.name} but did not have enough mana!`;
    }
    const base = dataManager.functions.baseDmg(baseHeal, heal, stat, scale);
    const statusMulti = dataManager.functions.statusDmg(caster);
    const rawHeal = Math.round(base * statusMulti);
    dataManager.functions.gainHP(target, rawHeal);
    dataManager.functions.abilityUsed(caster, this.name, this.mana);
    return `${aName} used ${this.name} and healed ${dName} for ${rawHeal} HP!`;
  }
}

module.exports = BandageAbility;