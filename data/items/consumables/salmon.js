const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class Salmon extends Consumable {
  constructor(data = {
    id: 'salmon',
    name: 'salmon',
    source: 'fishing',
    rarity: 2
  }) {
    super(data);
  }
}

module.exports = Salmon;