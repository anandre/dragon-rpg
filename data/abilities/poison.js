const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, 'data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class PoisonAbility extends Ability {
  constructor(data = {
    name: 'poison',
    mana: 5,
    cooldown: 3,
    description: 'Attempts to afflict the target with poison.',
    target: 'single'
  }) {
    super(data);
  }

  cast({
    attacker = undefined,
    defender = undefined,
  } = {}) {
    const status = dataManager.statuses.get('poison');
    if (attacker.currHP <= 0) return;
    const aName = dataManager.functions.displayName(attacker);
    const dName = dataManager.functions.displayName(defender);
    if (attacker.currMP < this.mana) {
      return `${aName} tried to use ${this.name} but did not have enough mana!`;
    }
    const toHit = 40 + attacker.focus - defender.resist;
    const roll = Math.random() * 100;
    dataManager.functions.abilityUsed(attacker, this.name, this.mana);
    if (roll < toHit) {
      defender.statuses.push(status);
      return `${aName} used ${this.name} against ${dName} and inflicted poison!`;
    }
    else {
      return `${aName} against ${dName}, but it was resisted!`;
    }
  }
}

module.exports = PoisonAbility;