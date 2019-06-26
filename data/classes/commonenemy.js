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

  get dodge() {
    return (5 + (this.level/3) + (this.agi * 1.2)).toFixed(2);
  }

  get maxHP() {
    return this.hpbase + Math.round(this.level/5) + (this.con * 10);
  }

  get magDef() {
    return Math.floor((this.level * 1.75) + (this.spr * 1.5));
  }

  get magicDodge() {
    return (10 + (this.level/5) + (this.spr * 1.3)).toFixed(2);
  }

  get magicToHitBonus() {
    return (1 + (this.level/3) + (this.mag * 1.1)).toFixed(2);
  }

  get maxMP() {
    return this.mpbase + (this.spr * 5) + Math.round(this.con * 1.25);
  }

  get physDef() {
    return Math.floor((this.level * 1.75) + (this.con * 1.3));
  }

  get toHitBonus() {
    return (1 + (this.level/4) + (this.agi * .9)).toFixed(2);
  }
}

module.exports = CommonEnemy;