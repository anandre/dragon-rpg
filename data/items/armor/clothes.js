const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Weapon = require(join(appDir, '/data/classes/weapon.js'));

class Clothes extends Weapon {
  constructor(data = {
    id: 'clothes',
    name: 'clothes',
    slot: 'armor',
    tough: 1,
    mind: 1,
    source: 'none',
    cost: 0,
    sell: 0,
    rarity: 3
  }) {
    super(data);

    this.description = 'Basic, everyday garments that offer no protection or extra utility.';
    this.abilities = [];
  }
}

module.exports = Clothes;