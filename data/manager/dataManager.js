const { Collection } = require('discord.js');
const fs = require('fs');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);

const data = {};
const abilities = new Collection();
const combat = new Collection();
const enemies = new Collection();
const items = new Collection();
const statuses = new Collection();
const functions = {};

fs.readdir(join(appDir, '/data/abilities/'), (err, files) => {
  for (const file of files) {
    if (!file.endsWith('.js')) return;
    const ability = new (require(join(appDir, `/data/abilities/${file}`)));
    abilities.set(ability.name, ability);
  }
});

data.abilities = abilities;

fs.readdir(join(appDir, '/data/enemies/'), (err, folders) => {
  for (const folder of folders) {
    fs.readdir(join(appDir, `/data/enemies/${folder}`), (err, files) => {
      for (const file of files) {
        if (!file.endsWith('.js')) return;
        const enemy = new (require(join(appDir, `/data/enemies/${folder}/${file}`)));
        enemies.set(enemy.id, enemy);
      }
    });
  }
});

data.combat = combat;

data.enemies = enemies;

fs.readdir(join(appDir, '/data/items'), (err, folders) => {
  for (const folder of folders) {
    fs.readdir(join(appDir, `/data/items/${folder}`), (err, files) => {
      for (const file of files) {
        if (!file.endsWith('.js')) return;
        const item = new (require(join(appDir, `/data/items/${folder}/${file}`)));
        items.set(item.id, item);
      }
    });
  }
});

data.items = items;

fs.readdir(join(appDir, '/functions/'), (err, folders) => {
  for (const folder of folders) {
    fs.readdir(join(appDir, `/functions/${folder}`), (err, files) => {
      for (const file of files) {
        const func = require(join(appDir, `/functions/${folder}/${file}`));
        const name = file.split('.')[0];
        functions[name] = func;
      }
    });
  }
});

data.functions = functions;

fs.readdir(join(appDir, '/data/statuses/'), (err, files) => {
  if (err) console.log(err);
  for (const file of files) {
    if (!file.endsWith('.js')) return;
    const status = new (require(join(appDir, `/data/statuses/${file}`)));
    statuses.set(status.name, status);
  }
});

data.statuses = statuses;

module.exports = data;