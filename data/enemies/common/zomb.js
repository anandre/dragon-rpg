const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const CommonEnemy = require(join(appDir, '/data/classes/commonenemy.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class Zombie extends CommonEnemy {
  constructor(data = {
    id: 'zomb',
    name: 'Zombie',
    level: 2,
    str: 5,
    agi: 3,
    con: 4,
    mag: 3,
    spr: 4,
    weaponid: 'claw',
    ai: 'cAggressiveLeastHP'
  }) {
    super(data);

    this.description = 'Zombies are tough but slow, these magically resurrected creatures hate all living things.';
    this.gold = 55;
    this.xp = 10;
    this.drops = [
      'meat',
      'idagg',
      'steelsword'
    ].map(d => d = { ...dataManager.items.get(d) });

    this.abilities = [
      'lunge',
      'bash'
    ].map(a => a = { ...dataManager.abilities.find(ab => ab.name === a) });

    this.hp = 40 + Math.floor(Math.random() * 3);
  }

  get maxHP() {
    return this.hp;
  }

  get maxMP() {
    return 15;
  }
}

module.exports = Zombie;