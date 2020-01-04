const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const CommonEnemy = require(join(appDir, '/data/classes/commonenemy.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Bandit extends CommonEnemy {
  constructor(data = {
    id: 'bandit',
    name: 'Bandit',
    level: 1,
    str: 4,
    agi: 3,
    con: 2,
    mag: 1,
    spr: 2,
    weaponid: 'idagg',
    ai: 'cAggressive'
  }) {
    super(data);

    this.description = 'Scourge of the road, a bandit prefers to destroy another\'s life to enrich his own.';
    this.xp = 6;
    this.gold = 50;
    this.speed = 3;
    this.drops = [
      'meat',
      'steelsword',
      'idagg']
      .map(d => d = { ...dataManager.items.get(d) });

    this.abilities = [
      'rush'
    ].map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });

    this.hp = 25 + Math.floor(Math.random() * 8);
  }

  get maxHP() {
    return this.hp;
  }

  get maxMP() {
    return 9;
  }
}

module.exports = Bandit;