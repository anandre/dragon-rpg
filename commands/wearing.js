const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

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
        const wornItems = (await this.client.db.query('SELECT weaponid, armorid, accessoryid FROM players WHERE playerid = $1', [message.author.id])).rows[0]
        const weapon = this.client.infoItems.get(wornItems.weaponid);
        const armor = this.client.infoItems.get(wornItems.armorid);
        const accessory = this.client.infoItems.get(wornItems.accessoryid);
        const type = {
            p: 'physical',
            m: 'magical'
        }
        const weaponAbilities = !weapon.abilities ? 'none' : weapon.abilities.join(', ');
        const armorAbilities = !armor.abilities ? 'none' : armor.abilities.join(', ');
        let weaponStr;
        let armorStr;
        let accessoryStr;
        if (args.long) {
            weaponStr = stripIndents`${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Damage**: ${weapon.weapondice} (${type[weapon.damagetype]})
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
            armorStr = stripIndents`${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Physical Defense**: ${armor.physdef}
            **Magical Defense**: ${armor.magdef}
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
            accessoryStr = stripIndents`${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
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
            weaponStr = stripIndents`${weapon.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Damage**: ${weapon.weapondice} (${type[weapon.damagetype]})
            **Abilities**: ${weaponAbilities}`
            armorStr = stripIndents`${armor.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substr(1)).join(' ')}
            **Physical Defense**: ${armor.physdef}
            **Magical Defense**: ${armor.magdef}
            **Abilities**: ${armorAbilities}`
            accessoryStr = stripIndents`${accessory.name.split(' ').map(m => m.charAt(0).toUpperCase() + m.substring(1)).join(' ')}`
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