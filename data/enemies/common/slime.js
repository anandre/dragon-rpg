const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const CommonEnemy = require(join(appDir, '/data/classes/commonenemy.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Slime extends CommonEnemy {
  constructor(data = {
    id: 'slime',
    name: 'Slime',
    level: 1,
    str: 1,
    agi: 1,
    con: 2,
    mag: 4,
    spr: 4,
    weaponid: 'goo',
    ai: 'cMage'
  }) {
    super(data);

    this.description = 'A magic experiment gone awry, these misshapen blobs have spread all over the countryside, multiplying constantly.';
    this.gold = 45;
    this.xp = 7;
    this.drops = [
      'bhorn',
      'meat',
      'approd'
    ].map(d => d = { ...dataManager.items.get(d) });

    this.abilities = [
      'spark',
      'flame',
      'icytouch'
    ].map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });

    this.hp = 22 + Math.floor(Math.random() * 5);
  }

  get maxHP() {
    return this.hp;
  }

  get maxMP() {
    return 20;
  }
}

module.exports = Slime;