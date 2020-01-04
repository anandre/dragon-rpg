const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Consumable = require(join(appDir, '/data/classes/consumable.js'));

class SpiderWeb extends Consumable {
  constructor(data = {
    id: 'sweb',
    name: 'spider\'s web',
    source: 'gathering',
    rarity: 2
  }) {
    super(data);
  }
}

module.exports = SpiderWeb;