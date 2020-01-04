const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Accessory = require(join(appDir, '/data/classes/accessory.js'));

class Pendant extends Accessory {
  constructor(data = {
    id: 'pendant',
    name: 'pendant',
    slot: 'accessory',
    hp: 5,
    mp: 5,
    source: 'none',
    cost: 0,
    sell: 0,
    rarity: 3
  }) {
    super(data);

    this.description = 'A pendant signifying one\'s beginning to the journey.';
    this.abilities = [];
  }
}

module.exports = Pendant;