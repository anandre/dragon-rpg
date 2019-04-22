const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');

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
            console.log(newGuilds);
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
                await this.client.channels.get('550762593443250186').send(`Joined ${newGuilds.join(', ')} while offline.`)
            };

            //check for guilds left while not on-line, then remove configs for each
            const deletedGuilds = this.client.guildSettings.filter(g => !this.client.guilds.has(g.id));
            const toDelete = `${deletedGuilds.map(x => x.id).join(`', '`)}`
            console.log(deletedGuilds.array());
            console.log(deletedGuilds.size);
            if (deletedGuilds.size > 0) {
                for (const guild of this.client.guildSettings.filter(g => !this.client.guilds.has(g.id))) {
                    this.client.guildSettings.delete(guild.id);
                }
                const query = `DELETE FROM guildsettings WHERE guildid IN ('${toDelete}')`
                await this.client.db.query(`${query}`);
                await this.client.channels.get('550762593443250186').send(`Left ${toDelete.replace(/[()]/g, '')} while offline.`)
            }

            //players - used to check if the user has a character started
            this.client.players = (await this.client.db.query(`SELECT playerid FROM players`)).rows.map(p => p.playerid);

            //enemies - used for info command combat-related commands
            const enemies = (await this.client.db.query('SELECT * FROM enemies')).rows;
            this.client.enemyInfo = new Collection();
            for (let enemy of enemies) {
                const data = {
                    enemyid: enemy.enemyid,
                    id: enemy.id,
                    name: enemy.name,
                    description: enemy.description,
                    abilities: enemy.abilities,
                    str: enemy.str,
                    agi: enemy.agi,
                    con: enemy.con,
                    mag: enemy.mag,
                    spr: enemy.spr,
                    hp: enemy.hp,
                    mp: enemy.mp,
                    xp: enemy.xp,
                    gold: enemy.gold,
                    rank: enemy.rank,
                    rarity: enemy.rarity,
                    physdef: enemy.physdef,
                    magdef: enemy.magdef,
                    damage: enemy.damage,
                    damagetype: enemy.damagetype,
                    drops: enemy.drops
                };
                this.client.enemyInfo.set(enemy.enemyid, data)
            };

            //items - for information, shop, gather and use
            const info = (await this.client.db.query('SELECT * FROM items')).rows;
            this.client.infoItems = new Collection();
            for (let item of info) {
                const items = {
                    itemid: item.itemid,
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    effects: item.effects,
                    str: item.strmod,
                    agi: item.agimod,
                    con: item.conmod,
                    mag: item.magmod,
                    spr: item.sprmod,
                    hp: item.hpmod,
                    mp: item.mpmod,
                    hunttimer: item.hunttimermod,
                    gathertimer: item.gathertimermod,
                    fishtimer: item.fishtimermod,
                    abilities: item.abilities,
                    source: item.source,
                    cost: item.cost,
                    sell: item.sell,
                    slot: item.slot,
                    weapondice: item.weapondice,
                    damagetype: item.damagetype,
                    physdef: item.physdef,
                    magef: item.magdef,
                    combat: item.combat
                };
                this.client.infoItems.set(item.itemid, item)
            };

            this.client.shopItems = this.client.infoItems.filter(i => i.source === 's');
            
            this.client.huntcom = this.client.infoItems.filter(i => i.source === 'h' && i.rarity === 1).array();
            this.client.huntunc = this.client.infoItems.filter(i => i.source === 'h' && i.rarity === 2).array();
            this.client.fishcom = this.client.infoItems.filter(i => i.source === 'f' && i.rarity === 1).array();
            this.client.fishunc = this.client.infoItems.filter(i => i.source === 'f' && i.rarity === 2).array();
            this.client.gathcom = this.client.infoItems.filter(i => i.source === 'g' && i.rarity === 1).array();
            this.client.gathunc = this.client.infoItems.filter(i => i.source === 'g' && i.rarity === 2).array();

            //abilities - for information command, combat use
            const abilities = (await this.client.db.query('SELECT * FROM abilities')).rows;
            this.client.abilities = new Collection();
            for (let abi of abilities) {
                const data = {
                    name: abi.name,
                    damage: abi.damage,
                    damagetype: abi.damagetype,
                    target: abi.target,
                    description: abi.description,
                    cooldown: abi.cooldown,
                    type: abi.type,
                    mana: abi.mana
                };
                this.client.abilities.set(abi.name, data)
            };

            //combat - for combat progress
            const combatInfo = (await this.client.db.query(`SELECT * FROM combat`)).rows;
            this.client.combat = new Collection();
            for (let combat of combatInfo) {
                const ongoingCombat = {
                    playerid: combat.playerid,
                    str: combat.str,
                    agi: combat.agi,
                    con: combat.con,
                    mag: combat.mag,
                    spr: combat.spr,
                    currhp: combat.currhp,
                    maxhp: combat.maxhp,
                    currmp: combat.currmp,
                    maxmp: combat.maxmp,
                    weaponid: combat.weaponid,
                    armorid: combat.armorid,
                    abilities: combat.abilities,
                    damagetype: combat.damagetype,
                    physdef: combat.physdef,
                    magdef: combat.magdef,
                    enemyid: combat.enemyid,
                    enemyhp: combat.enemyhp,
                    enemymp: combat.enemymp,
                    turn: combat.turn,
                    cooldowns: combat.cooldowns,
                    enemycd: combat.enemycd
                };
                this.client.combat.set(combat.playerid, ongoingCombat)
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