const { Listener } = require('discord-akairo');
const Discord = require('discord.js');

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
            const gSettings = (await this.client.db.query(`SELECT * FROM guildsettings`)).rows;
            console.log(gSettings);
            this.client.guildSettings = new Discord.Collection();
            for (let guild of gSettings) {
                const settings = {
                    prefix: guild.prefix,
                    channel: guild.channel
                }
                this.client.guildSettings.set(guild.guildid, settings);
            }
            console.log(this.client.guildSettings.map(x => x));
            this.client.players = (await this.client.db.query(`SELECT playerid FROM players`)).rows.map(p => p.playerid);
            this.client.huntcom = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['h', 1])).rows;
            this.client.huntunc = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['h', 2])).rows;
            this.client.fishcom = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['f', 1])).rows;
            this.client.fishunc = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['f', 2])).rows;
            this.client.gathcom = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['g', 1])).rows;
            this.client.gathunc = (await this.client.db.query(`SELECT itemid, name FROM items WHERE source = $1 AND rarity = $2`, ['g', 2])).rows;
            //const shop = (await this.client.db.query("SELECT id, itemid, name, description, strmod, agimod, conmod, magmod, sprmod, hpmod, mpmod, hunttimermod, gathertimermod, fishtimermod, abilities, source, cost, sell, slot FROM items WHERE source = $1", ['s'])).rows
            const enemies = (await this.client.db.query('SELECT * FROM enemies')).rows;
            const info = (await this.client.db.query("SELECT * FROM items")).rows;
            const combatInfo = (await this.client.db.query(`SELECT * FROM combat`)).rows;
            const abilities = (await this.client.db.query('SELECT * FROM abilities')).rows;

            this.client.abilities = new Discord.Collection();
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
                }
                this.client.abilities.set(abi.name, data)
            }
            console.log(`Enemies: ${enemies}`)
            this.client.combat = new Discord.Collection();
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
                    maxmp: combat.currmp,
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
                    enemycd: combat.enemycds
                }
                this.client.combat.set(combat.playerid, ongoingCombat)
            }

            this.client.enemyInfo = new Discord.Collection();
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
                    damagetype: enemy.damagetype
                }
                this.client.enemyInfo.set(enemy.enemyid, data)
            }
            
            this.client.infoItems = new Discord.Collection();
            for (let item of info) {
                const items = {
                    itemid: item.itemid,
                    id: item.id,
                    name: item.name,
                    description: item.description,
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
                    magef: item.magdef
                }
                this.client.infoItems.set(item.itemid, item)
            }

            this.client.shopItems = this.client.infoItems.filter(i => i.source === 's');
        }
        catch (e) {
            console.log(`Error starting up:
            ${e.message}
            ${e.stack}`)
        }
    }
}

module.exports = ReadyListener;