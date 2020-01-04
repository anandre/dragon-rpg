class Ability {
  constructor(data) {
    if (new.target === 'Ability') {
      throw new TypeError('Cannot instantiate an Ability class directly.');
    }

    this.name = data.name;
    this.mana = data.mana;
    this.cooldown = data.cooldown;
    this.description = data.description;
    this.target = data.target;

    this.damage = data.damage;
    this.damagestat = data.damagestat;
    this.damagetype = data.damagetype;
    this.element = data.element ? data.element : null;
  }
}

module.exports = Ability;