const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Ability = require(join(appDir, '/data/classes/ability.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class SwipeAbility extends Ability {
  constructor(data = {
    name: 'swipe',
    cooldown: 5,
    mana: 9,
    damage: 5,
    damagestat: 'str',
    damagetype: 'physical',
    target: 'group',
    description: 'A devastating attack that can hit multiple targets at once due to its long reach.'
  }) {
    super(data);
  }

  cast({
    attacker = undefined,
    baseDamage = 2.25,
    dmg = this.damage,
    stat = attacker[this.damagestat],
    scale = 0.8,
    combat = undefined
  } = {}) {
    if (attacker.currHP <= 0) return;
    const aName = dataManager.functions.displayName(attacker);
    if (attacker.currMP < this.mana) {
      return `${aName} tried to cast ${this.name} but did not have enough mana.`;
    }
    const baseDmg = dataManager.functions.baseDmg(baseDamage, dmg, stat, scale);
    const statusMulti = dataManager.functions.statusDmg(attacker);
    const rawDmg = Math.round(baseDmg * statusMulti);
    const targets = combat.filter(f => f.side === 'player');
    let res = `${aName} used ${this.name} and dealt `;
    for (const defender of targets) {
      const baseDefense = dataManager.functions.statusDefense(defender).physDef;
      const netDmg = Math.max(rawDmg - baseDefense, 0);
      dataManager.functions.loseHP(defender, netDmg);
      res += `\`${netDmg}\` damage to ${defender.name}, `;
    }
    dataManager.functions.abilityUsed(attacker, this.name, this.mana);
    return res;
  }
}

module.exports = SwipeAbility;