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
    weaponid: 76
  }) {
    super(client, data)

    this.description = 'Scourge of the road, a bandit prefers to destroy another\'s life to enrich his own.'
    this.xp = 6;
    this.gold = 50;
    this.drops = [
      'meat',
      'steel sword',
      'iron dagger'];
    
    this.abilities = [
      'rush'
    ];
  }
}

module.exports = Bandit;