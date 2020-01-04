const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const CommonEnemy = require(join(appDir, '/data/classes/commonenemy.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Goblin extends CommonEnemy {
  constructor(data = {
    id: 'gob',
    name: 'Goblin',
    level: 1,
    str: 5,
    agi: 2,
    con: 3,
    mag: 1,
    spr: 1,
    weaponid: 'claw',
    ai: 'cAggressive'
  }) {
    super(data);

    this.description = 'Short and swarthy, these creatures prefer to prey on the unsuspecting but can also defend against a warrior hunting them.';
    this.gold = 35;
    this.xp = 5;
    this.drops = [
      'dirt',
      'trout',
      'idagg'
    ].map(d => d = { ...dataManager.items.get(d) });

    this.abilities = [
      'swipe'
    ].map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });

    this.hp = 20 + Math.floor(Math.random() * 6);
  }

  get maxHP() {
    return this.hp;
  }

  get maxMP() {
    return 10;
  }
}

module.exports = Goblin;