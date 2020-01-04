const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class BrokenHorn extends Consumable {
  constructor(data = {
    id: 'bhorn',
    name: 'broken horn',
    source: 'hunting',
    rarity: 2
  }) {
    super(data);
  }
}

module.exports = BrokenHorn;