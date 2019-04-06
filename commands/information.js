const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class InformationCommand extends Command {
    constructor() {
        super('information', {
            aliases: ['information', 'info'],
            channel: 'guild',
            category: 'utility',
            description: {
                content: 'Displays information about a path or item',
                usage: 'info (path | item)',
                example : 'information warrior'
            },
            args: [
                {
                    id: 'lookup',
                    match: 'content'
                }
            ]
        })
    }

    async exec(message, args) {
        console.log('info');
        const info = args.lookup.toLowerCase();
        if (['warrior', 'rogue', 'priest', 'mage'].includes(info)) {
            if (info === 'warrior') {
                try {
                    const embed = new MessageEmbed()
                    .setTitle(`Information on ${args.lookup.charAt(0).toUpperCase()}${args.lookup.substr(1).toLowerCase()}`)
                    .setDescription(`${this.client.warrior.description}\n**Starting Strength**: ${this.client.warrior.str}
                    **Starting Agility**: ${this.client.warrior.agi}
                    **Starting Constitution**: ${this.client.warrior.con}
                    **Starting Magic**: ${this.client.warrior.mag}
                    **Starting Spirit**: ${this.client.warrior.spr}
                    **Starting HP**: ${this.client.warrior.hpmod}
                    **Starting MP**: ${this.client.warrior.mpmod}
                    **Starting Weapon**: ${this.client.infoItems.get(this.client.warrior.weapon).name}
                    **Starting Armor**: ${this.client.infoItems.get(this.client.warrior.armor).name}
                    **Starting Accessory**: ${this.client.infoItems.get(this.client.warrior.accessory).name}`)
                    return message.channel.send(embed);
                }
                catch (e) {
                    message.channel.send('There was an error retrieving information!  Please report this to my maker, an invite link can be found in the `invite` command.')
                    this.client.channels.get('547399254864560138').send(`Error getting information on ${message.guild.name}.
                    ${e.message}
                    ${e.stack}`, {code: 'xxl'})
                }
            }
            if (info === 'rogue') {
                try {
                    const embed = new MessageEmbed()
                    .setTitle(`Information on ${args.lookup.charAt(0).toUpperCase()}${args.lookup.substr(1).toLowerCase()}`)
                    .setDescription(`${this.client.rogue.description}
                    **Starting Strength**: ${this.client.rogue.str}
                    **Starting Agility**: ${this.client.rogue.agi}
                    **Starting Constitution**: ${this.client.rogue.con}
                    **Starting Magic**: ${this.client.rogue.mag}
                    **Starting Spirit**: ${this.client.rogue.spr}
                    **Starting HP**: ${this.client.rogue.hpmod}
                    **Starting MP**: ${this.client.rogue.mpmod}
                    **Starting Weapon**: ${this.client.infoItems.get(this.client.rogue.weapon).name}
                    **Starting Armor**: ${this.client.infoItems.get(this.client.rogue.armor).name}
                    **Starting Accessory**: ${this.client.infoItems.get(this.client.rogue.accessory).name}`)
                    return message.channel.send(embed);
                }
                catch (e) {
                    message.channel.send('There was an error retrieving information!  Please report this to my maker, an invite link can be found in the `invite` command.')
                    this.client.channels.get('547399254864560138').send(`Error getting information on ${message.guild.name}.
                    ${e.message}
                    ${e.stack}`, {code: 'xxl'})
                }
            }
            if (info === 'priest') {
                try {
                    const embed = new MessageEmbed()
                    .setTitle(`Information on ${args.lookup.charAt(0).toUpperCase()}${args.lookup.substr(1).toLowerCase()}`)
                    .setDescription(`${this.client.priest.description}
                    **Starting Strength**: ${this.client.priest.str}
                    **Starting Agility**: ${this.client.priest.agi}
                    **Starting Constitution**: ${this.client.priest.con}
                    **Starting Magic**: ${this.client.priest.mag}
                    **Starting Spirit**: ${this.client.priest.spr}
                    **Starting HP**: ${this.client.priest.hpmod}
                    **Starting MP**: ${this.client.priest.mpmod}
                    **Starting Weapon**: ${this.client.infoItems.get(this.client.priest.weapon).name}
                    **Starting Armor**: ${this.client.infoItems.get(this.client.priest.armor).name}
                    **Starting Accessory**: ${this.client.infoItems.get(this.client.priest.accessory).name}`)
                    return message.channel.send(embed);
                }
                catch (e) {
                    message.channel.send('There was an error retrieving information!  Please report this to my maker, an invite link can be found in the `invite` command.')
                    this.client.channels.get('547399254864560138').send(`Error getting information on ${message.guild.name}.
                    ${e.message}
                    ${e.stack}`, {code: 'xxl'})
                }
            }
            if (info === 'mage') {
                try {
                    const embed = new MessageEmbed()
                    .setTitle(`Information on ${args.lookup.charAt(0).toUpperCase()}${args.lookup.substr(1).toLowerCase()}`)
                    .setDescription(`${this.client.mage.description}
                    **Starting Strength**: ${this.client.mage.str}
                    **Starting Agility**: ${this.client.mage.agi}
                    **Starting Constitution**: ${this.client.mage.con}
                    **Starting Magic**: ${this.client.mage.mag}
                    **Starting Spirit**: ${this.client.mage.spr}
                    **Starting HP**: ${this.client.mage.hpmod}
                    **Starting MP**: ${this.client.mage.mpmod}
                    **Starting Weapon**: ${this.client.infoItems.get(this.client.mage.weapon).name}
                    **Starting Armor**: ${this.client.infoItems.get(this.client.mage.armor).name}
                    **Starting Accessory**: ${this.client.infoItems.get(this.client.mage.accessory).name}`)
                    return message.channel.send(embed);
                }
                catch (e) {
                    message.channel.send('There was an error retrieving information!  Please report this to my maker, an invite link can be found in the `invite` command.')
                    this.client.channels.get('547399254864560138').send(`Error getting information on ${message.guild.name}.
                    ${e.message}
                    ${e.stack}`, {code: 'xxl'})
                }
            }
        }
        if (this.client.infoItems.some(i => i.name === info || i.id === info)) {
            console.log('getting item');
            const foundItem = this.client.infoItems.find(i => i.name === info) || this.client.infoItems.find(i => i.id === info);
            console.log(foundItem)           
            const replace = {
                'a': 'armor',
                'w': 'weapon',
                'c': 'accessory',
                's': 'shop',
                'u': 'upgrade',
                'b': 'combat'
            }
            let itemDesc = `Name: ${foundItem.name}
            ID: ${foundItem.id}
            Description: ${foundItem.description}`
            itemDesc += foundItem.effects ? '\nEffects: ' + foundItem.effects : '';
            if (foundItem.abilities) {
                itemDesc += foundItem.abilities.length > 0 ? '\nAbilities: ' + foundItem.abilities.join(', ') : '';
            }
            itemDesc += foundItem.slot ? '\nSlot: ' + replace[foundItem.slot] : '';
            itemDesc += foundItem.strmod || foundItem.strmod === 0 ? '\nStrength: ' + foundItem.strmod : '';
            itemDesc += foundItem.agimod || foundItem.agimod === 0 ? '\nAgility: ' + foundItem.agimod : '';
            itemDesc += foundItem.conmod || foundItem.conmod === 0 ? '\nConstitution: ' + foundItem.conmod : '';
            itemDesc += foundItem.magmod || foundItem.magmod === 0 ? '\nMagic: ' + foundItem.magmod : '';
            itemDesc += foundItem.sprmod || foundItem.sprmod === 0 ? '\nSpirit: ' + foundItem.sprmod : '';
            itemDesc += foundItem.hpmod || foundItem.hpmod === 0 ? '\nHP: ' + foundItem.hpmod : '';
            itemDesc += foundItem.mpmod || foundItem.mpmod === 0 ? '\nMP: ' + foundItem.mpmod : '';
            itemDesc += foundItem.hunttimermod ? '\nHunt timer mod: -' + (1 - foundItem.hunttimermod) * 100 + '%' : '';
            itemDesc += foundItem.fishtimermod ? '\nHunt timer mod: -' + (1 - foundItem.fishtimermod) * 100 + '%' : '';
            itemDesc += foundItem.gathertimermod ? '\nHunt timer mod: -' + (1 - foundItem.gathertimermod) * 100 + '%' : '';
            itemDesc += foundItem.source ? '\nSource: ' + replace[foundItem.source] : '';
            itemDesc += foundItem.cost && foundItem.sell ? '\nCost: ' + foundItem.cost + ', sell for: ' + foundItem.sell : '';
            //source, cost, sells for, slot
            const embed = new MessageEmbed()
            .setDescription(itemDesc)
            try {
                message.channel.send(embed)
            }
            catch (e) {
                message.channel.send(`${e.message}
                ${e.stack}`)
            }
        }
    }
}

module.exports = InformationCommand;