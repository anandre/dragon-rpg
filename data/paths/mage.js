const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const ClassBase = require(join(appDir, '/data/classes/base.js'));
const mage = require(join(appDir, '/data/mage.json'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Mage extends ClassBase {
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

    this.path = 'Mage';
    this.fero = 1.25;
    this.speed = 2;

    this.levelStats = mage.find(i => i.level === this.level);
    this.itemStats = dataManager.functions.sumItemStats(this.weapon, this.armor, this.accessory);

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
    return 10 + (1 + (this.level * 0.25) + (this.agi * 0.825)).toFixed(2);
  }

  // increased chance to be missed
  get dodge() {
    return 5 + ((this.level * 0.2) + (this.agi * 0.75)).toFixed(2);
  }

  // increased to hit magical chance
  get focus() {
    return 10 + ((this.level * 0.30) + (this.mag * 0.9)).toFixed(2);
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
    return 5 + Math.round((this.level * 0.3) + (this.spr * 0.4));
  }

  // increased crit chance
  get prec() {
    return ((this.level * 0.2) + (this.agi * 0.825)).toFixed(2);
  }

  // increased chance to resist debuffs
  get resist() {
    return 5 + ((this.level * 0.16) + (this.spr * 0.7)).toFixed(2);
  }

  // reduces physical damage taken
  get tough() {
    return Math.round((this.level * 0.25) + (this.con * 0.8));
  }
}

module.exports = Mage;