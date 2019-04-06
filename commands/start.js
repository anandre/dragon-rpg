const { Command } = require('discord-akairo');

class StartCommand extends Command {
    constructor() {
        super('start', {
            aliases: ['start', 'register'],
            channel: 'guild',
            category: 'rpg',
            args: [{
                id: 'path',
                type: ['Warrior', 'Priest', 'Rogue', 'Mage'],
                prompt: {
                    start: 'Are you going to follow the path of the Warrior, Priest, Rogue, or Mage?  If you are unsure, you can say \`cancel\` to choose later.',
                    retry: 'That is not a valid path!',
                    timeout: 'If you need more time to think about your choice, please ask for more information.',
                    cancel: 'If you need more time to think about your choice, please ask for more information.',
                    retries: 2
                }
            }],
                description: {
                    content: 'Choose your starting path.',
                    usage: 'start -> respond to prompt',
                    example: 'start -> Warrior' 
                  }
            
        })
    }

    async exec(message, args) {
        if (args.path === 'Warrior') {
            try {
                await this.client.db.query("INSERT INTO players (playerid, path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, hunttimer, gathertimer, fishtimer, armorid, weaponid, accessoryid, gold, huntmod, fishmod, gathermod, physdef, magdef) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT (playerid) DO NOTHING",
                [message.author.id, this.client.warrior.name, 0, 1, this.client.warrior.str + 2, this.client.warrior.agi + 2 , this.client.warrior.con, this.client.warrior.mag, this.client.warrior.spr, this.client.warrior.hpmod + 5, this.client.warrior.hpmod + 5, this.client.warrior.mpmod + 5, this.client.warrior.mpmod + 5, message.createdTimestamp, message.createdTimestamp, message.createdTimestamp, this.client.warrior.armor, this.client.warrior.weapon, this.client.warrior.accessory, 50, 1, 1, 1, 2, 1]);
                this.client.players.push(message.author.id);
                await this.client.db.query(`CREATE TABLE ${'inv' + message.author.id} (itemid INTEGER UNIQUE, count INTEGER)`);
                return message.channel.send('You have embarked upon the noble path of the Warrior.  May you gain the strength to challenge the dragons.')
            }
            catch (e) {
                message.channel.send(`${e.message}
                ${e.stack}`)
            }
        }
        else if (args.path === 'Priest') {
            try {
                await this.client.db.query("INSERT INTO players (playerid, path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, hunttimer, gathertimer, fishtimer, armorid, weaponid, accessoryid, gold, huntmod, fishmod, gathermod, physdef, magdef) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT (playerid) DO NOTHING",
                [message.author.id, this.client.priest.name, 0, 1, this.client.priest.str, this.client.priest.agi, this.client.priest.con, this.client.priest.mag, this.client.priest.spr, this.client.priest.hpmod, this.client.priest.hpmod, this.client.priest.mpmod, this.client.priest.mpmod, message.createdTimestamp, message.createdTimestamp, message.createdTimestamp, this.client.priest.armor, this.client.priest.weapon, this.client.warrior.accessory, 50, 1, 1, 1, 1, 2]);
                this.client.players.push(message.author.id);
                await this.client.db.query(`CREATE TABLE ${'inv' + message.author.id} (itemid INTEGER UNIQUE, count INTEGER)`);
                return message.channel.send('You have taken your first step on the path of a Priest.  May you gain the wisdom to challenge the dragons.')
            }
            catch (e) {
                message.channel.send(`${e.message}
                ${e.stack}`)
            }
        }
        else if (args.path === 'Rogue') {
            try {
                await this.client.db.query("INSERT INTO players (playerid, path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, hunttimer, gathertimer, fishtimer, armorid, weaponid, accessoryid, gold, huntmod, fishmod, gathermod, physdef, magdef) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT (playerid) DO NOTHING",
                [message.author.id, this.client.rogue.name, 0, 1, this.client.rogue.str, this.client.rogue.agi, this.client.rogue.con, this.client.rogue.mag, this.client.rogue.spr, this.client.rogue.hpmod, this.client.rogue.hpmod, this.client.rogue.mpmod, this.client.rogue.mpmod, message.createdTimestamp, message.createdTimestamp, message.createdTimestamp, this.client.rogue.armor, this.client.rogue.weapon, this.client.rogue.accessory, 50, 1, 1, 1, 2, 1]);
                await this.client.db.query(`CREATE TABLE ${'inv' + message.author.id} (itemid INTEGER UNIQUE, count INTEGER)`);                
                this.client.players.push(message.author.id);
                return message.channel.send('You have become a shadow, a trickster, a true Rogue.  May you gain the skill to challenge the dragons.')
            }
            catch (e) {
                message.channel.send(`${e.message}
                ${e.stack}`)
            }
        }
        else if (args.path === 'Mage') {
            try {
                await this.client.db.query("INSERT INTO players (playerid, path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, hunttimer, gathertimer, fishtimer, armorid, weaponid, accessoryid, gold, huntmod, fishmod, gathermod, physdef, magdef) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT (playerid) DO NOTHING",
                [message.author.id, this.client.mage.name, 0, 1, this.client.mage.str, this.client.mage.agi, this.client.mage.con, this.client.mage.mag, this.client.mage.spr, this.client.mage.hpmod, this.client.mage.hpmod, this.client.mage.mpmod, this.client.mage.mpmod, message.createdTimestamp, message.createdTimestamp, message.createdTimestamp, this.client.mage.armor, this.client.mage.weapon, this.client.mage.accessory, 50, 1, 1, 1, 1, 2]);
                this.client.players.push(message.author.id);
                await this.client.db.query(`CREATE TABLE ${'inv' + message.author.id} (itemid INTEGER UNIQUE, count INTEGER)`);
                return message.channel.send('You have dedicated your life\'s path to learning the destructive ways of the Mage.  May you gain the knowledge to challenge the dragons.')
            }
            catch (e) {
                message.channel.send(`${e.message}
                ${e.stack}`)
            }
        }
    }
}

module.exports = StartCommand;