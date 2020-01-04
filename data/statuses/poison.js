const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const Status = require(join(appDir, '/data/classes/status.js'));

class Poison extends Status {
  constructor(data = {
    name:'poison',
    duration: 4
  }) {
    super(data);

    this.damage = 5;
    this.description = `Deals damage equal to **${this.damage}%** max HP every round for ${this.duration} rounds.`;
  }

  effect(target) {
    const rawDmg = Math.round(target.maxHP * 0.2);
    target.currHP -= Math.min(target.currHP, rawDmg);
    return `${target.side === 'monster' ? target.id : target.name} lost ${rawDmg} HP from ${this.name}`;
  }
}

module.exports = Poison;