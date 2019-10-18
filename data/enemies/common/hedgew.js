const CommonEnemy = require('../../classes/commonenemy.js');

class HedgeWitch extends CommonEnemy {
  constructor(client, data = {
    id: 'hedgew',
    name: 'Hedge Witch',
    level: 3,
    str: 2,
    agi: 2,
    con: 3,
    mag: 6,
    spr: 4
  }) {
    super(client, data)
    
    this.description = 'Small and fast, a witch will cast a spell on you without hesitation.';
    this.gold = 45;
    this.drops = [
      'salmon',
      'spider\'s web'
    ];

    this.abilites = [
      'potion throw',
      'poison'
    ];

    //this.weapon = this.client.items.get(77);
  }
}

module.exports = HedgeWitch;