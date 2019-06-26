const ClassBase = require('../classes/base.js');

class Warrior extends ClassBase {
  constructor(client, data) {
    super(client, data)

    this.weaponid = data.weaponid;
    this.armorid = data.armorid;
    this.accessoryid = data.accessoryid;
    this.xp = data.xp;

    this.path = 'Warrior';
  }

  get dodge() {
    return (5 + (this.level/3) + (this.agi * 1.2)).toFixed(2);
  }

  get maxHP() {
    return this.hpbase + Math.round(this.level/4) + (this.con * 11);
  }

  get magDef() {
    return Math.floor((this.level * 1.6) + (this.spr * 1.3));
  }

  get magicDodge() {
    return (10 + (this.level/5) + (this.spr * 1.15)).toFixed(2);
  }

  get magicToHitBonus() {
    return (1 + (this.level/4) + (this.mag * 1.1)).toFixed(2);
  }

  get maxMP() {
    return this.mpbase + (this.spr * 4) + Math.round(this.con * 1.25);
  }

  get physDef() {
    return Math.floor((this.level * 1.75) + (this.con * 1.3));
  }

  get toHitBonus() {
    return (1 + (this.level/4) + (this.agi * .9)).toFixed(2);
  }
}