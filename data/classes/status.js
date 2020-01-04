class Status {
  constructor(data) {
    if (new.target === 'Status') {
      throw new TypeError('Cannot instantiate a Status class directly.');
    }
    this.name = data.name;
    this.duration = data.duration;
  }
}

module.exports = Status;