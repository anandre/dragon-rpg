const CommonEnemy = require('../classes/commonenemy.js');

class Slime extends CommonEnemy {
  constructor(client, data = {
    id: 'slime',
    name: 'Slime',
    level: 1,
    str: 1,
    agi: 1,
    con: 2,
    mag: 4,
    spr: 4
  }) {
    super(client, data)

    this.description = 'A magic experiment gone awry, these misshapen blobs have spread all over the countryside, multiplying constantly.';
    this.gold = 45;
    this.drops = [
      'broken horn',
      'meat',
      'apprentice\'s rod'
    ];

    this.abilitie = [
      'spark',
      'flame',
      'icy touch'
    ];
    //update this to correct weapon when made
    this.weapon = this.client.items.get(77)
  }

  attack() {
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 1.4).toFixed(2)) + 1) * this.weapon.attack) + 1 + Math.max(Math.floor(this.mag/3),1);
    return baseDmg;
  }
}

module.exports = Slime;