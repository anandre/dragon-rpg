const ClassBase = require('../classes/base.js');
const rogue = require('../rogue.json');

class Rogue extends ClassBase {
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

    this.path = 'Rogue';
    this.fero = 1.4;

    this.#levelStats = rogue.find(i => i.level === this.level);

    this.str = this.#levelStats.str + this.weapon.str + this.armor.str + this.accessory.str;
    this.agi = this.#levelStats.agi + this.weapon.agi + this.armor.agi + this.accessory.agi;
    this.con = this.#levelStats.con + this.weapon.con + this.armor.con + this.accessory.con;
    this.mag = this.#levelStats.mag + this.weapon.mag + this.armor.mag + this.accessory.mag;
    this.spr = this.#levelStats.spr + this.weapon.spr + this.armor.spr + this.accessory.spr;
    this.abilities = this.#levelStats.abilities.concat(this.weapon.abilities).concat(this.armor.abilities).concat(this.accessory.abilities);
  }

  get acc() { //increased to hit chance
    return 10 + (1 + (this.level * .35) + (this.agi * 1)).toFixed(2);
  }

  get dodge() { //increased chance to be missed
    return 5 + ((this.level * .25) + (this.agi * .85)).toFixed(2);
  }

  get focus() { //increased to hit magical chance
    return 10 + ((this.level * .15) + (this.mag * .7)).toFixed(2);
  }

  get maxHP() { //max HP, overwritten in paths
    return (this.#levelStats.hp) + (this.con * 4) + this.weapon.hp + this.armor.hp + this.accessory.hp;
  }

  get maxMP() { //max MP, overwritten in paths
    return (this.#levelStats.mp) + (this.spr * 2) + this.weapon.mp + this.armor.mp + this.accessory.mp;
  }

  get mind() { //reduces magical damage taken
    return 5 + ((this.level * .3) + (this.spr * .4)).toFixed(2);
  }

  get prec() { //increased crit chance
    return ((this.level * .2) + (this.agi * .825)).toFixed(2);
  }

  get resist() { //increased chance to resist debuffs
    return 5 + ((this.level * .16) + (this.spr * .7)).toFixed(2);
  }

  get tough() { //reduces physical damage taken
    return ((this.level * .25) + (this.con * .8)).toFixed(2);
  }
}

module.exports = Rogue;