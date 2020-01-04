const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const ClassBase = require(join(appDir, '/data/classes/base.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class CommonEnemy extends ClassBase {
  constructor(data) {
    if (new.target === CommonEnemy) {
      throw new TypeError('Cannot instantiate a CommonEnemy class directly.');
    }
    super(data);

    this.weapon = dataManager.items.get(data.weaponid);

    this.speed = 2;

    this.rarity = 'common';
    this.ai = data.ai;

    // Ferocity
    this.fero = 1.5;
  }

  /* Accuracy (agi)
  Precision (agi) (increased crit chance)
  Ferocity (class-based) (Crit Multi)
  Dodge (agi)
  Focus (mag) (mag. to-hit)
  HP (con)
  Init (agi)
  Resistance (spr) (mag resist to debuffs)
  MP (spr)
  Mind (spr) (magical defense, equivalent to toughness)
  Toughness (con) */

  // increased to hit chance
  get acc() {
    return 10 + (1 + (this.level * 0.25) + (this.agi * 0.9)).toFixed(2);
  }

  // increased chance to be missed
  get dodge() {
    return 5 + ((this.level * 0.25) + (this.agi * 0.8)).toFixed(2);
  }

  // increased to hit magical chance
  get focus() {
    return 10 + ((this.level * 0.17) + (this.mag * 0.8)).toFixed(2);
  }

  // reduces magical damage taken
  get mind() {
    return 5 + Math.round((this.level * 0.2) + (this.spr * 0.2));
  }

  // increased crit chance
  get prec() {
    return ((this.level * 0.17) + (this.agi * 0.7)).toFixed(2);
  }

  // increased chance to resist debuffs
  get resist() {
    return 5 + ((this.level * 0.14) + (this.spr * 0.6)).toFixed(2);
  }

  // reduces physical damage taken
  get tough() {
    return Math.round((this.level * 0.25) + (this.con * 0.8));
  }
}

for (const prop of ['acc', 'dodge', 'focus', 'maxHP', 'maxMP', 'mind', 'prec', 'resist', 'tough']) {
  Object.defineProperty(CommonEnemy.prototype, prop, { enumerable: true });
}

module.exports = CommonEnemy;