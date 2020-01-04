const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, '/data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class IcyTouchAbility extends Ability {
  constructor(data = {
    name: 'icytouch',
    mana: 3,
    cooldown: 2,
    element: 'ice',
    damagetype: 'physical'
  }) {
    super(data);

    this.description = 'A cantrip to temporarily freeze the caster\'s weapon and get in a quick strike.';
  }

  cast({
    attacker = undefined,
    defender = undefined,
    element = this.element
  } = {}) {
    if (attacker.currHP <= 0) return;
    const aName = dataManager.functions.displayName(attacker);
    if (attacker.currMP < this.mana) {
      return `${aName} tried to use ${this.name} but did not have enough mana.`;
    }
    dataManager.functions.abilityUsed(attacker, this.name, this.mana);
    return attacker.weapon.attack({ attacker: attacker, defender: defender, element: element });
  }
}

module.exports = IcyTouchAbility;