const ClassBase = require('../classes/base.js');
const warrior = require('../warrior.json');

class Warrior extends ClassBase {
  #levelStats;
  constructor(client, data) {
    super(client, data)

    this.weapon = this.client.items.get(data.weaponid);
    this.armor = this.client.items.get(data.armorid);
    this.accessory = this.client.items.get(data.accessoryid);
    this.level = data.level;
    this.xp = data.xp;
    this.gold = data.gold;
    this.currHP = data.currHP;
    this.currMP = data.currMP;

    this.path = 'Warrior';
    this.fero = 1.5;

    this.#levelStats = warrior.find(i => i.level === this.level);

    this.str = this.#levelStats.str + this.weapon.str + this.armor.str + this.accessory.str;
    this.agi = this.#levelStats.agi + this.weapon.agi + this.armor.agi + this.accessory.agi;
    this.con = this.#levelStats.con + this.weapon.con + this.armor.con + this.accessory.con;
    this.mag = this.#levelStats.mag + this.weapon.mag + this.armor.mag + this.accessory.mag;
    this.spr = this.#levelStats.spr + this.weapon.spr + this.armor.spr + this.accessory.spr;
    this.abilities = this.#levelStats.abilities.concat(this.weapon.abilities).concat(this.armor.abilities).concat(this.accessory.abilities);
  }

  get acc() { //increased to hit chance
    return 10 + (1 + (this.level * .25) + (this.agi * .9)).toFixed(2);
  }

  get dodge() { //increased chance to be missed
    return 5 + ((this.level * .20) + (this.agi * .8)).toFixed(2);
  }

  get focus() { //increased to hit magical chance
    return 10 + ((this.level * .15) + (this.mag * .8)).toFixed(2);
  }

  get maxHP() { //max HP, overwritten in paths
    return (this.#levelStats.hp) + (this.con * 5) + this.weapon.hp + this.armor.hp + this.accessory.hp;
  }

  get maxMP() { //max MP, overwritten in paths
    return (this.#levelStats.mp) + (this.spr * 2) + this.weapon.mp + this.armor.mp + this.accessory.mp;
  }

  get mind() { //reduces magical damage taken
    return 5 + ((this.level * .3) + (this.spr * .4)).toFixed(2);
  }

  get prec() { //increased crit chance
    return ((this.level * .15) + (this.agi * .7)).toFixed(2);
  }

  get resist() { //increased chance to resist debuffs
    return 5 + ((this.level * .16) + (this.spr * .7)).toFixed(2);
  }

  get tough() { //reduces physical damage taken
    return ((this.level * .33) + (this.con * .9)).toFixed(2);
  }
}

module.exports = Warrior;