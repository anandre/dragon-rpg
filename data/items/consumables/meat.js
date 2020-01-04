const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class Meat extends Consumable {
  constructor(data = {
    id: 'meat',
    name: 'edible meat',
    source: 'hunting',
    rarity: 2
  }) {
    super(data);
  }
}

module.exports = Meat;