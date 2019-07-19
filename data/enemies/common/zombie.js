const CommonEnemy = require('../../classes/commonenemy.js');

class Zombie extends CommonEnemy {
  constructor(client, data = {
    id: 'zomb',
    name: 'Zombie',
    level: 2,
    str: 5,
    agi: 3,
    con: 4,
    mag: 3,
    spr: 4
  }) {
    super(client, data)

    this.description = 'Zombies are tough but slow, these magically resurrected creatures hate all living things.';
    this.gold = 55;
    this.drop = [
      'iron dagger',
      'edible meat'
    ];

    this.abilities = [
      'lunge',
      'bash'
    ]

    this.weapon = this.client.items.get(76);
  }
}

module.exports = Zombie;