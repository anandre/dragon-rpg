const CommonEnemy = require('../../classes/commonenemy.js');

class Goblin extends CommonEnemy {
  constructor(client, data = {
    id: 'gob',
    name: 'Goblin',
    level: 1,
    str: 5,
    agi: 2,
    con: 3,
    mag: 1,
    spr: 1
  }) {
    super(client, data)

    this.description = 'Short and swarthy, these creatures prefer to prey on the unsuspecting but can also defend against a warrior hunting them.';
    this.gold = 35;
    this.drops = [
      'dirt',
      'iron dagger',
      'trout'
    ];

    this.abilities = [
      'rush',
      'bash',
      'swipe'
    ];

    this.weapon = this.client.items.get(76);
  }

  attack() {
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 1.5).toFixed(2)) + 1) * this.weapon.attack) + 1 + Math.max(Math.floor(this.str/3),1);
    return baseDmg;
  }
}

module.exports = Goblin;