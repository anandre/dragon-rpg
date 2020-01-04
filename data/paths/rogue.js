const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const ClassBase = require(join(appDir, '/data/classes/base.js'));
const rogue = require(join(appDir, '/data/rogue.json'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Rogue extends ClassBase {
  constructor(data) {
    super(data);

    this.weapon = dataManager.items.get(data.weaponid);
    this.armor = dataManager.items.get(data.armorid);
    this.accessory = dataManager.items.get(data.accessoryid);
    this.level = data.level;
    this.xp = data.xp;
    this.gold = data.gold;
    this.currHP = data.currHP;
    this.currMP = data.currMP;

    this.path = 'Rogue';
    this.fero = 1.4;
    this.speed = 4;

    this.itemStats = dataManager.functions.sumItemStats(this.weapon, this.armor, this.accessory);
    this.levelStats = rogue.find(i => i.level === this.level);

    this.str = this.levelStats.str + this.itemStats.str;
    this.agi = this.levelStats.agi + this.itemStats.agi;
    this.con = this.levelStats.con + this.itemStats.con;
    this.mag = this.levelStats.mag + this.itemStats.mag;
    this.spr = this.levelStats.spr + this.itemStats.spr;
    this.abilities = this.levelStats.abilities
      .concat(this.weapon.abilities)
      .concat(this.armor.abilities)
      .concat(this.accessory.abilities)
      .map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });
  }

  // increased to hit chance
  get acc() {
    return 10 + (1 + (this.level * 0.35) + (this.agi * 1) + this.itemStats.acc).toFixed(2);
  }

  // increased chance to be missed
  get dodge() {
    return 5 + ((this.level * 0.25) + (this.agi * 0.85) + this.itemStats.dodge).toFixed(2);
  }

  // increased to hit magical chance
  get focus() {
    return 10 + ((this.level * 0.15) + (this.mag * 0.7 + this.itemStats.focus)).toFixed(2);
  }

  // max HP, overwritten in paths
  get maxHP() {
    return (this.levelStats.hp) + (this.con * 4) + this.itemStats.hp;
  }

  // max MP, overwritten in paths
  get maxMP() {
    return (this.levelStats.mp) + (this.spr * 2) + this.itemStats.mp;
  }

  // reduces magical damage taken
  get mind() {
    return 5 + Math.round((this.level * 0.3) + (this.spr * 0.4) + this.itemStats.mind);
  }

  // increased crit chance
  get prec() {
    return ((this.level * 0.2) + (this.agi * 0.825) + this.itemStats.prec).toFixed(2);
  }

  // increased chance to resist debuffs
  get resist() {
    return 5 + ((this.level * 0.16) + (this.spr * 0.7) + this.itemStats.resist).toFixed(2);
  }

  // reduces physical damage taken
  get tough() {
    return Math.round((this.level * 0.25) + (this.con * 0.8) + this.itemStats.tough);
  }
}

module.exports = Rogue;