const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class Trout extends Consumable {
  constructor(data = {
    id: 'trout',
    name: 'trout',
    source: 'fishing',
    rarity: 1
  }) {
    super(data);
  }
}

module.exports = Trout;