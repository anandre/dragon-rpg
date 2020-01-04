class Armor {
  constructor(data) {
    if (new.target === 'Armor') {
      throw new TypeError('Cannot instantiate an Armor class directly.');
    }

    this.id = data.id;
    this.name = data.name;

    this.acc = data.acc ? data.acc : 0;
    this.prec = data.prec ? data.prec : 0;
    this.focus = data.focus ? data.focu : 0;

    this.tough = data.tough ? data.tough : 0;
    this.mind = data.mind ? data.mind : 0;
    this.dodge = data.dodge ? data.dodge : 0;
    this.resist = data.resist ? data.resist : 0;

    this.str = data.str ? data.str : 0;
    this.agi = data.agi ? data.agi : 0;
    this.con = data.con ? data.con : 0;
    this.mag = data.mag ? data.mag : 0;
    this.spr = data.spr ? data.spr : 0;
    this.hp = data.hp ? data.hp : 0;
    this.mp = data.mp ? data.mp : 0;
    this.hunttimer = data.hunttimer ? data.hunttimer : 1;
    this.gathertimer = data.gathertimer ? data.gathertimer : 1;
    this.fishtimer = data.fishtimer ? data.fishtimer : 1;

    this.source = data.source;
    this.cost = data.cost;
    this.sell = data.sell;
    this.slot = data.slot;
    this.rarity = data.rarity;
  }
}

module.exports = Armor;