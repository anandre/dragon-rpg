const ClassBase = require('./base.js');

class CommonEnemy extends ClassBase {
  constructor(client, data) {
    if (new.target === CommonEnemy) {
      throw new TypeError('Cannot instantiate a CommonEnemy class directly.')
    }
    super(client, data)

    this.hpbase = 5;
    this.mpbase = 2;

    this.rarity = 'common';
    this.xp = this.level * 4; 
  }

  /*Accuracy (agi)
  Precision (agi) (increased crit chance)
  Ferocity (class-based) (Crit Multi)
  Dodge (agi)
  Focus (mag) (mag. to-hit)
  HP (con)
  Init (agi)
  Resistance (spr) (mag resist to debuffs)
  MP (spr)
  Mind (spr) (magical defense, equivalent to toughness)
  Toughness (con)*/

  get acc() { //increased to hit chance
    return (1 + (this.level/4) + (this.agi * .9)).toFixed(2);
  }

  get dodge() { //increased chance to be missed
    return ((this.level/3) + (this.agi * .8)).toFixed(2);
  }

  get focus() { //increased to hit magical chance
    return ((this.level/6) + (this.mag * .8)).toFixed(2);
  }

  get maxHP() { //max HP, overwritten in paths
    return this.hpbase * 5;
  }

  get prec() { //increased crit chance
    return ((this.level/6) + (this.agi * .7)).toFixed(2);
  }
}

module.exports = CommonEnemy;