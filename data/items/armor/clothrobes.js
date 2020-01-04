const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Armor = require(join(appDir, '/data/classes/armor.js'));

class ClothRobes extends Armor {
  constructor(data = {
    id: 'crobes',
    name: 'cloth robes',
    tough: 1,
    mind: 3,
    hp: 3,
    mp: 7,
    source: 'none',
    cost: 0,
    sell: 0,
    rarity: 3,
    slot: 'armor'
  }) {
    super(data);

    this.description = 'Non-descript robes given to initiates.';
    this.abilities = [];
  }
}

module.exports = ClothRobes;