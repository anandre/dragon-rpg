class ClassBase {
  constructor(client, data) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    this.client = client;
    this.str = data.str;
    this.agi = data.agi;
    this.con = data.con;
    this.mag = data.mag;
    this.spr = data.spr;
  }
}

module.exports = ClassBase;