const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class Dirt extends Consumable {
  constructor(data = {
    id: 'dirt',
    name: 'dirt',
    source: 'gathering',
    rarity: 2
  }) {
    super(data);
  }
}

module.exports = Dirt;