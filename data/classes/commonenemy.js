const ClassBase = require('./base.js');

class CommonEnemy extends ClassBase {
  constructor(client, data) {
    if (new.target === CommonEnemy) {
      throw new TypeError('Cannot instantiate a CommonEnemy class directly.')
    }
    super(client, data)

    this.weapon = this.client.items.get(data.weaponid);

    this.hpbase = 5;
    this.mpbase = 2;

    this.rarity = 'common';
    
    this.fero = 1.5; //Ferocity
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
    return 10 + (1 + (this.level * .25) + (this.agi * .9)).toFixed(2);
  }

  get dodge() { //increased chance to be missed
    return 5 + ((this.level * .25) + (this.agi * .8)).toFixed(2);
  }

  get focus() { //increased to hit magical chance
    return 10 + ((this.level * .17) + (this.mag * .8)).toFixed(2);
  }

  get maxHP() { //max HP, overwritten in paths
    return this.hpbase * 10;
  }

  get maxMP() { //max MP, overwritten in paths
    return this.mpbase * 5;
  }

  get mind() { //reduces magical damage taken
    return 5 + ((this.level * .2) + (this.spr * .2)).toFixed(2);
  }

  get prec() { //increased crit chance
    return ((this.level * .17) + (this.agi * .7)).toFixed(2);
  }

  get resist() { //increased chance to resist debuffs
    return 5 + ((this.level * .14) + (this.spr * .6)).toFixed(2);
  }

  get tough() { //reduces physical damage taken
    return ((this.level * .25) + (this.con * .8)).toFixed(2);
  }
}

for (const prop of ['acc', 'dodge', 'focus', 'maxHP', 'maxMP', 'mind', 'prec', 'resist', 'tough']) {
  Object.defineProperty(CommonEnemy.prototype, prop, { enumerable: true });
}

module.exports = CommonEnemy;