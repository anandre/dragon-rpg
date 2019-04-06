const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class WearingCommand extends Command {
    constructor() {
        super('wearing', {
            aliases: ['wearing'],
            category: 'rpg',
            channel: 'guild',
            description: {
                content: 'Show current equipment for yourself or another player',
                usage: 'wearing [user] [--long]',
                example: 'wearing @Mark | 167988857046827010 | Mark#2320'
            },
            args: [{
                id: 'user',
                type: 'user',
                default: message => message.author
            },
            {
                id: 'long',
                match: 'flag',
                flag: '--long'
            }]
        })
    }

    async exec(message, args) {
        //const weapon = (await this.client.db.query(`SELECT players.weaponid, items.name, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.hunttimermod, items.gathertimermod, items.fishtimermod FROM players INNER JOIN items ON players.weaponid = items.itemid WHERE playerid = '${user.id}'`));
        //const armor = (await this.client.db.query(`SELECT players.armorid, items.name, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.hunttimermod, items.gathertimermod, items.fishtimermod FROM players INNER JOIN items ON players.armorid = items.itemid WHERE playerid = '${user.id}'`)).rows[0];
        //const accessoryid = (await this.client.db.query(`SELECT players.accessoryid, items.name, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.hunttimermod, items.gathertimermod, items.fishtimermod FROM players INNER JOIN items ON players.accessoryid = items.itemid WHERE playerid = '${user.id}'`)).rows[0];
        if (!this.client.players.includes(args.user.id)) return;
        const weapon = (await this.client.db.query(`SELECT players.weaponid, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.weaponid = items.itemid WHERE playerid = '${args.user.id}'`)).rows[0]
        console.log(weapon);
        const armor = (await this.client.db.query(`SELECT players.armorid, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.armorid = items.itemid WHERE playerid = '${args.user.id}'`)).rows[0]
        console.log(armor);
        const accessory = (await this.client.db.query(`SELECT players.accessoryid, items.abilities, items.strmod, items.agimod, items.conmod, items.magmod, items.sprmod, items.hpmod, items.mpmod, items.name, items.gathertimermod, items.fishtimermod, items.hunttimermod, items.slot FROM players INNER JOIN items ON players.accessoryid = items.itemid WHERE playerid = '${args.user.id}'`)).rows[0]
        console.log(accessory);
        const weaponAbilities = !weapon.abilities ? 'none' : weapon.abilities.join(', ');
        const armorAbilities = !armor.abilities ? 'none' : armor.abilities.join(', ');
        let weaponStr;
        let armorStr;
        let accessoryStr;
        if (args.long) {
            weaponStr = `${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Abilities**: ${weaponAbilities}
            **Strength:** ${weapon.strmod}
            **Agility:** ${weapon.agimod}
            **Constitution**: ${weapon.conmod}
            **Magic:** ${weapon.magmod}
            **Spirit:** ${weapon.sprmod}
            **HP:** ${weapon.hpmod}
            **MP**: ${weapon.mpmod}
            **Gather mod:** -${(1 - weapon.gathertimermod) * 100}%
            **Fish mod:** -${(1 - weapon.fishtimermod) * 100}%
            **Hunt mod:** -${(1 - weapon.hunttimermod) * 100}%`
            armorStr = `${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Abilities**: ${armorAbilities}
            **Strength:** ${armor.strmod}
            **Agility:** ${armor.agimod}
            **Constitution**: ${armor.conmod}
            **Magic:** ${armor.magmod}
            **Spirit:** ${armor.sprmod}
            **HP:** ${armor.hpmod}
            **MP**: ${armor.mpmod}
            **Gather mod:** -${(1 - armor.gathertimermod) * 100}%
            **Fish mod:** -${(1 - armor.fishtimermod) * 100}%
            **Hunt mod:** -${(1 - armor.hunttimermod) * 100}%`
            accessoryStr = `${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Strength:** ${accessory.strmod}
            **Agility:** ${accessory.agimod}
            **Constitution**: ${accessory.conmod}
            **Magic:** ${accessory.magmod}
            **Spirit:** ${accessory.sprmod}
            **HP:** ${accessory.hpmod}
            **MP**: ${accessory.mpmod}
            **Gather mod:** -${(1 - accessory.gathertimermod) * 100}%
            **Fish mod:** -${(1 - accessory.fishtimermod) * 100}%
            **Hunt mod:** -${(1 - accessory.hunttimermod) * 100}%`
        }
        else {
            weaponStr = `${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Abilities**: ${weaponAbilities}`
            armorStr = `${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Abilities**: ${armorAbilities}`
            accessoryStr = `${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substring(1)).join(' ')}`
        }
        const embed = new MessageEmbed()
            .setAuthor(args.user.username, args.user.displayAvatarURL())
            .setDescription(`${args.user.username}'s current items`)
            .addField('Weapon', weaponStr, true)
            .addField('Armor', armorStr, true)
            .addField('Accessory', accessoryStr, true)
            .setTimestamp()
        message.channel.send(embed);
    }
}

module.exports = WearingCommand;