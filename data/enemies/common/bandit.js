const CommonEnemy = require('../../classes/commonenemy.js');

class Bandit extends CommonEnemy {
  constructor(client, data = {
    id: 'bandit',
    name: 'Bandit',
    level: 1,
    str: 4,
    agi: 3,
    con: 2,
    mag: 1,
    spr: 2,
  }) {
    super(client, data)

    this.description = 'Scourge of the road, a bandit prefers to destroy another\'s life to enrich his own.'
    this.gold = 50;
    this.drops = [
      'meat',
      'steel sword',
      'iron dagger'];
    
    this.abilities = [
      'rush',
      'bash',
      'stab'
    ];

    this.weapon = this.client.items.get(25);
  }

  attack(defender, dStatuses) {
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 1.5).toFixed(2)) + 1) * this.weapon.attack) + 1 + Math.max(Math.floor(this.str/3),1);
    return baseDmg;
  }
}

module.exports = Bandit;