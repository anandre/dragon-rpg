const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const CommonEnemy = require(join(appDir, '/data/classes/commonenemy.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class HedgeWitch extends CommonEnemy {
  constructor(data = {
    id: 'hedgew',
    name: 'Hedge Witch',
    level: 3,
    str: 2,
    agi: 2,
    con: 3,
    mag: 6,
    spr: 4,
    ai: 'cMage',
    weaponid: 'approd'
  }) {
    super(data);

    this.description = 'Small and fast, a witch will cast a spell on you without hesitation.';
    this.gold = 45;
    this.xp = 8;
    this.drops = [
      'salmon',
      'trout',
      'spider\'s web'
    ].map(d => d = { ...dataManager.items.get(d) });

    this.abilities = [
      'poison'
    ].map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });

    this.hp = 40 + Math.floor(Math.random() * 4);
  }

  get maxHP() {
    return this.hp;
  }

  get maxMP() {
    return 26;
  }
}

module.exports = HedgeWitch;