const { Command } = require('discord-akairo');

class WearCommand extends Command {
    constructor() {
        super('wear', {
            aliases: ['wear', 'w'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Change your equipment',
                usage: 'wear (item name | item nickname | nothing)',
                example: 'wear iron dagger | irondagger | nothing'
            },
            args: [{
                id: 'item',
                match: "rest"
            }]
        })
    }

    async exec(message, args) {
        const inventory = (await this.client.db.query(`SELECT ${'inv' + message.author.id}.itemid, items.id, items.name, items.slot, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.gathertimermod, items.fishtimermod, items.hunttimermod FROM ${'inv' + message.author.id} INNER JOIN items ON ${'inv' + message.author.id}.itemid = items.itemid WHERE items.rarity > 2`)).rows
        let wearing = [];
        const currentStats = (await this.client.db.query(`SELECT str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, gathermod, fishmod, huntmod FROM players WHERE playerid = $1`, [message.author.id])).rows[0];
        const putOn = inventory.find(it => it.id === args.item) || inventory.find(it => it.name === args.item)
        const weapon = (await this.client.db.query(`SELECT players.weaponid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.weaponid = items.itemid WHERE playerid = '${message.author.id}'`)).rows[0]
        const armor = (await this.client.db.query(`SELECT players.armorid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.armorid = items.itemid WHERE playerid = '${message.author.id}'`)).rows[0]
        const accessory = (await this.client.db.query(`SELECT players.accessoryid, items.itemid, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.accessoryid = items.itemid WHERE playerid = '${message.author.id}'`)).rows[0]
        wearing.push(weapon, armor, accessory)
        if (args.item === 'nothing') {
            try {
                await this.client.db.query(`INSERT INTO ${'inv' + message.author.id} (itemid, count) VALUES (${weapon.itemid}, 1) ON CONFLICT (itemid) DO UPDATE SET count = ${'inv' + message.author.id}.count + 1 WHERE ${'inv' + message.author.id}.itemid = ${weapon.itemid}`);
                await this.client.db.query(`INSERT INTO ${'inv' + message.author.id} (itemid, count) VALUES (${armor.itemid}, 1) ON CONFLICT (itemid) DO UPDATE SET count = ${'inv' + message.author.id}.count + 1 WHERE ${'inv' + message.author.id}.itemid = ${armor.itemid}`);
                await this.client.db.query(`INSERT INTO ${'inv' + message.author.id} (itemid, count) VALUES (${accessory.itemid}, 1) ON CONFLICT (itemid) DO UPDATE SET count = ${'inv' + message.author.id}.count + 1 WHERE ${'inv' + message.author.id}.itemid = ${accessory.itemid}`);
                await this.client.db.query(`UPDATE players SET armorid = 47, weaponid = 46, accessoryid = 48 WHERE playerid = '${message.author.id}'`)
                return message.channel.send('You have removed your equipment.');
            }
            catch (e) {
                message.channel.send('There was a problem, please come to the support server if help is needed.  An invite can be found in the `?invite` command.');
                this.client.channels.get('547399254864560138').send(`Error when trying to equip nothing for ${message.author.id}. ${e.message}
                ${e.stack}`)
            }
        }
        if (putOn && wearing.find(e => e.name === putOn.name && e.slot === putOn.slot)) {
            return message.reply('you\'re already wearing that!');
        }
        else if (putOn && !wearing.some(e => e.name === putOn.name)) {
            const currentItem = wearing.find(s => s.slot === putOn.slot);
            const strChange = currentStats.str - currentItem.strmod + putOn.strmod;
            const agiChange = currentStats.agi - currentItem.agimod + putOn.agimod;
            const conChange = currentStats.con - currentItem.conmod + putOn.conmod;
            const magChange = currentStats.mag - currentItem.magmod + putOn.magmod;
            const sprChange = currentStats.spr - currentItem.sprmod + putOn.sprmod;
            const hpChange = currentStats.maxhp - currentItem.hpmod + putOn.hpmod;
            const mpChange = currentStats.maxmp - currentItem.mpmod + putOn.mpmod;
            const currHPChange = currentStats.currhp - currentItem.hpmod + putOn.hpmod;
            const currMPChange = currentStats.currmp - currentItem.mpmod + putOn.mpmod;
            const huntChange = currentStats.huntmod / currentItem.hunttimermod * putOn.hunttimermod;
            const fishChange = currentStats.fishmod / currentItem.fishtimermod * putOn.fishtimermod;
            const gatherChange = currentStats.gathermod / currentItem.gathertimermod * putOn.gathertimermod;
            const newSlot = {
                'a': 'armorid',
                'c': 'accessoryid',
                'w': 'weaponid'
            }
            try {
                console.log('1')
                if (currentItem.name !== 'nothing') {
                    await this.client.db.query(`INSERT INTO ${'inv' + message.author.id} (itemid, count) VALUES (${currentItem.itemid}, 1) ON CONFLICT (itemid) DO UPDATE SET count = ${'inv' + message.author.id}.count + 1 WHERE ${'inv' + message.author.id}.itemid = ${currentItem.itemid}`)
                }
                console.log('2')
                const newAmt = await this.client.db.query(`UPDATE ${'inv' + message.author.id} SET count = count - 1 WHERE itemid = ${putOn.itemid}`)
                console.log('3')
                await this.client.db.query(`DELETE FROM ${'inv' + message.author.id} WHERE count < 1`);
                await this.client.db.query(`DELETE FROM ${'inv' + message.author.id} WHERE itemid = 46 OR itemid = 47 OR itemid = 48`)
                console.log('4')
                await this.client.db.query(`UPDATE players SET ${newSlot[putOn.slot]} = ${putOn.itemid}, str = ${strChange}, agi = ${agiChange}, con = ${conChange}, mag = ${magChange}, spr = ${sprChange}, currhp = ${currHPChange}, maxhp = ${hpChange}, currmp = ${currMPChange}, maxmp = ${mpChange}, huntmod = ${huntChange}, gathermod = ${gatherChange}, fishmod = ${fishChange} WHERE playerid = '${message.author.id}'`)
                console.log('5')
                //console.log(`${currentStats.maxhp} - ${currentItem.hpmod} + ${putOn.hpmod} hp change`);
                //console.log(`Old HP: ${currentStats.maxhp} New HP: ${currentStats.maxhp + putOn.hpmod - currentItem.hpmod}`)
                return message.channel.send(`You have equipped ${putOn.name}`);
            }
            catch (e) {
                message.channel.send('There was an error changing your equipment.  Please report this in my server.');
                this.client.channels.get('547399254864560138').send(`There was an error in the wearing command. ${e.message}
                ${e.stack}`)
            }
        }
        else return message.channel.send('You don\'t have that!');
    }
}

module.exports = WearCommand;