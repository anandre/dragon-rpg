class ClassBase {
  constructor(data) {
    if (new.target === ClassBase) {
      throw new TypeError('Cannot instantiate a ClassBase class directly.');
    }
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    this.str = data.str;
    this.agi = data.agi;
    this.con = data.con;
    this.mag = data.mag;
    this.spr = data.spr;

    this.statuses = [];
  }

}

module.exports = ClassBase;