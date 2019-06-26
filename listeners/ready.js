const { Listener } = require('discord-akairo');
const { Collection, MessageEmbed } = require('discord.js');
const enemies = require('../data/enemies.json');
const weapons = require('../data/weapons.json');
const armor = require('../data/armor.json');
const accessories = require('../data/accessories.json');
const consumables = require('../data/consumables.json');
const statuses = require('../data/statuses.json');
const abilities = require('../data/abilities.json');
const fs = require('fs');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  async exec() {
    console.log(this.client.user.username)
    console.log(`Online at ${new Date()}.`);
    try {
      //guild settings - prefix and channels to run in
      const gSettings = (await this.client.db.query(`SELECT * FROM guildsettings`)).rows;

      this.client.guildSettings = new Collection();
      for (let guild of gSettings) {
        const settings = {
          id: guild.guildid,
          prefix: guild.prefix,
          channel: guild.channel
        }
        this.client.guildSettings.set(guild.guildid, settings);
      };

      //check for guilds joined while not on-line, then add default configs for each
      const newGuilds = this.client.guilds.filter(g => !this.client.guildSettings.has(g.id)).array();

      let query = `INSERT INTO guildsettings (guildid, prefix, channel) VALUES `
      let params = [];

      for (let i = 0, k = 0; i < newGuilds.length; i ++, k += 3) {
        if (i === newGuilds.length - 1) {
        query += `($${k + 1}, $${k + 2}, $${k + 3})`
        }
        else {
          query += `($${k + 1}, $${k + 2}, $${k + 3}), `
        }
        params.push(`${newGuilds[i].id}`, '{";"}', '{}')
        this.client.guildSettings.set(newGuilds[i].id, { id: newGuilds[i].id, prefix: [';'], channel: [] });
      }

      query += ` ON CONFLICT (guildid) DO NOTHING`

      if (params.length > 1) {
        await this.client.db.query(`${query}`, params);
        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`Joined ${newGuilds.join(', ')} while offline.`)
        this.client.channels.get('550762593443250186').send(embed);
        //await this.client.channels.get('550762593443250186').send(`Joined ${newGuilds.join(', ')} while offline.`)
      };

      //check for guilds left while not on-line, then remove configs for each
      const deletedGuilds = this.client.guildSettings.filter(g => !this.client.guilds.has(g.id));
      const toDelete = `${deletedGuilds.map(x => x.id).join(`', '`)}`
      if (deletedGuilds.size > 0) {
        for (const guild of this.client.guildSettings.filter(g => !this.client.guilds.has(g.id))) {
          this.client.guildSettings.delete(guild.id);
        }
        const query = `DELETE FROM guildsettings WHERE guildid IN ('${toDelete}')`
        await this.client.db.query(`${query}`);
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle(`Left ${toDelete.replace(/[()]/g, '')} while offline.`);
        await this.client.channels.get('550762593443250186').send(embed);
        //await this.client.channels.get('550762593443250186').send(`Left ${toDelete.replace(/[()]/g, '')} while offline.`)
      }

      //players - used to check if the user has a character started
      this.client.players = (await this.client.db.query(`SELECT playerid FROM players`)).rows.map(p => p.playerid);

      //enemies - used for info command combat-related commands
      this.client.enemies = new Collection();
      fs.readdir('./data/enemies/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(f => {
          if (!f.endsWith('.js')) return;
          const enemy = new (require(`../data/enemies/${f}`))(this.client);
          this.client.enemies.set(enemy.id, enemy);
        })
      })
      //for (let enemy of enemies) {
      //  this.client.enemies.set(enemy.enemyid, enemy)
      //};

      //items - for information, shop, gather and use
      this.client.items = new Collection();
      for (let item of weapons) {
        this.client.items.set(item.itemid, item)
      };
      for (let item of armor) {
        this.client.items.set(item.itemid, item);
      }
      for (let item of accessories) {
        this.client.items.set(item.itemid, item);
      }
      for (let item of consumables) {
        this.client.items.set(item.itemid, item);
      }

      this.client.shopItems = this.client.items.filter(i => i.source === 's');
      this.client.huntcom = this.client.items.filter(i => i.source === 'h' && i.rarity === 1);
      this.client.huntunc = this.client.items.filter(i => i.source === 'h' && i.rarity === 2);
      this.client.fishcom = this.client.items.filter(i => i.source === 'f' && i.rarity === 1);
      this.client.fishunc = this.client.items.filter(i => i.source === 'f' && i.rarity === 2);
      this.client.gathcom = this.client.items.filter(i => i.source === 'g' && i.rarity === 1);
      this.client.gathunc = this.client.items.filter(i => i.source === 'g' && i.rarity === 2);

      //abilities - for information command, combat use
      this.client.abilities = new Collection();
      for (let abi of abilities) {
        this.client.abilities.set(abi.name, abi)
      };

      //statuses - for information command, combat use
      this.client.statuses = new Collection();
      for (let status of statuses) {
        this.client.statuses.set(status.name, status)
      }

      //combat - for combat progress
      const combatInfo = (await this.client.db.query(`SELECT * FROM combat`)).rows;
      this.client.combat = new Collection();
      for (let combat of combatInfo) {
        this.client.combat.set(combat.id, combat.data)
      };
    }
    catch (e) {
      console.log(`Error starting up:
      ${e.message}
      ${e.stack}`)
    }
  }
}

module.exports = ReadyListener;