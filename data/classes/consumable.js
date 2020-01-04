class Consumable {
  constructor(data) {
    if (new.target === 'Consumable') {
      throw new TypeError('Cannot directly instantiate a new Consumable class.');
    }
    this.id = data.id;
    this.name = data.name;
    this.rarity = data.rarity;
    this.source = data.source;
  }
}

module.exports = Consumable;