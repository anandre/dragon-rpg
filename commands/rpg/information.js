const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class InformationCommand extends Command {
  constructor() {
    super('information', {
      aliases: ['information', 'info'],
      channel: 'guild',
      category: 'utility',
      description: {
        content: 'Displays information about something in the game.',
        usage: 'info (path | item | enemy | ability)',
        example : 'information warrior'
      },
      args: [
        {
          id: 'info',
          match: 'content'
        }
      ]
    })
  }

  async exec(message, { info }) {
        if (this.client.abilities.some(i => i.name === info)) {
            const ability = this.client.abilities.find(i => i.name === info);
            const type = {
                d: `${ability.damage}`,
                h: `${ability.damage}`,
                s: '',
                p: ' (physical) ',
                m: ' (magical) ',
                n: '',
                s: 'self',
                t: 'single',
                a: 'all enemies'

            }
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`Information on ${info}.`)
                .setDescription(stripIndents`**Dice**: ${type[ability.type]}${type[ability.damagetype]}
                **Effect**: ${ability.description}
                **Target**: ${type[ability.target]}
                **Mana cost**: ${ability.mana}
                **Cooldown**: ${ability.cooldown}`)
            return message.channel.send(embed);
        }
        if (this.client.enemies.some(i => i.name === info)) {
            const enemy = this.client.enemies.find(i => i.name === info);
            const type = {
                p: ' (physical) ',
                m: ' (magical) ',
                n: '',
                c: 'common',
                u: 'uncommon',
                b: 'boss'
            }
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`Information on ${info}.`)
                .setDescription(stripIndents`**Name**: ${enemy.name}
                **ID**: ${enemy.id}
                **Description**: ${enemy.description}
                **Regular attack**: ${enemy.damage} ${type[enemy.damagetype]}
                **Abilities**: ${enemy.abilities.join(', ')}
                **Possible drops**: ${enemy.drops.join(', ')}
                **Rarity**: ${type[enemy.rarity]}`)
            return message.channel.send(embed);
        }
        if (['warrior', 'rogue', 'priest', 'mage'].includes(info)) {
            if (info === 'warrior') {
                try {
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(stripIndents`Information on ${info.charAt(0).toUpperCase()}${info.substr(1).toLowerCase()}`)
                        .setDescription(`${this.client.warrior.description}\n**Starting Strength**: ${this.client.warrior.str}
                        **Starting Agility**: ${this.client.warrior.agi}
                        **Starting Constitution**: ${this.client.warrior.con}
                        **Starting Magic**: ${this.client.warrior.mag}
                        **Starting Spirit**: ${this.client.warrior.spr}
                        **Starting HP**: ${this.client.warrior.hpmod}
                        **Starting MP**: ${this.client.warrior.mpmod}
                        **Starting Weapon**: ${this.client.items.get(this.client.warrior.weapon).name}
                        **Starting Armor**: ${this.client.items.get(this.client.warrior.armor).name}
                        **Starting Accessory**: ${this.client.items.get(this.client.warrior.accessory).name}`)
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
                        .setColor('GREEN')
                        .setTitle(stripIndents`Information on ${info.charAt(0).toUpperCase()}${info.substr(1).toLowerCase()}`)
                        .setDescription(`${this.client.rogue.description}
                        **Starting Strength**: ${this.client.rogue.str}
                        **Starting Agility**: ${this.client.rogue.agi}
                        **Starting Constitution**: ${this.client.rogue.con}
                        **Starting Magic**: ${this.client.rogue.mag}
                        **Starting Spirit**: ${this.client.rogue.spr}
                        **Starting HP**: ${this.client.rogue.hpmod}
                        **Starting MP**: ${this.client.rogue.mpmod}
                        **Starting Weapon**: ${this.client.items.get(this.client.rogue.weapon).name}
                        **Starting Armor**: ${this.client.items.get(this.client.rogue.armor).name}
                        **Starting Accessory**: ${this.client.items.get(this.client.rogue.accessory).name}`)
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
                        .setColor('WHITE')
                        .setTitle(stripIndents`Information on ${info.charAt(0).toUpperCase()}${info.substr(1).toLowerCase()}`)
                        .setDescription(`${this.client.priest.description}
                        **Starting Strength**: ${this.client.priest.str}
                        **Starting Agility**: ${this.client.priest.agi}
                        **Starting Constitution**: ${this.client.priest.con}
                        **Starting Magic**: ${this.client.priest.mag}
                        **Starting Spirit**: ${this.client.priest.spr}
                        **Starting HP**: ${this.client.priest.hpmod}
                        **Starting MP**: ${this.client.priest.mpmod}
                        **Starting Weapon**: ${this.client.items.get(this.client.priest.weapon).name}
                        **Starting Armor**: ${this.client.items.get(this.client.priest.armor).name}
                        **Starting Accessory**: ${this.client.items.get(this.client.priest.accessory).name}`)
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
                        .setColor('BLACK')
                        .setTitle(stripIndents`Information on ${info.charAt(0).toUpperCase()}${info.substr(1).toLowerCase()}`)
                        .setDescription(`${this.client.mage.description}
                        **Starting Strength**: ${this.client.mage.str}
                        **Starting Agility**: ${this.client.mage.agi}
                        **Starting Constitution**: ${this.client.mage.con}
                        **Starting Magic**: ${this.client.mage.mag}
                        **Starting Spirit**: ${this.client.mage.spr}
                        **Starting HP**: ${this.client.mage.hpmod}
                        **Starting MP**: ${this.client.mage.mpmod}
                        **Starting Weapon**: ${this.client.items.get(this.client.mage.weapon).name}
                        **Starting Armor**: ${this.client.items.get(this.client.mage.armor).name}
                        **Starting Accessory**: ${this.client.items.get(this.client.mage.accessory).name}`)
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
        if (this.client.items.some(i => i.name === info || i.id === info)) {
            const item = this.client.items.find(i => i.name === info) || this.client.items.find(i => i.id === info);          
            const replace = {
                a: 'armor',
                w: 'weapon',
                c: 'accessory',
                s: 'shop',
                u: 'upgrade',
                b: 'combat',
                p: ' (physical)',
                m: ' (magical)',
                n: ''
            }
            const embed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`Information on ${info}.`)
                .setDescription(stripIndents`**Name**: ${item.name}
                **ID** ${item.id}
                **Description**: ${item.description}
                **Source**: ${replace[item.source]}
                ${item.effects ? `**Effects**: + ${item.effects}` : ''}
                ${item.slot ? `**Slot** ${replace[item.slot]}` : ''}
                ${item.weapondice ? `**Damage**: ${item.weapondice} ${replace[item.damagetype]}` : ''}
                ${item.physdef >= 0 || item.magdef >= 0 ? `**Physical defense**: ${item.physdef ? item.physdef : 0}, **Magical defense**: ${item.magdef ? item.magdef : 0}` : ''}
                ${item.abilities ? `**Abilities**: ${item.abilities.join(', ')}` : ''}
                ${item.strmod >= 0 ? `**Strength**: ${item.strmod} ` : ''}
                ${item.agimod >= 0 ? `**Agility**: ${item.agimod}` : ''}
                ${item.conmod >= 0 ? `**Constitution**: ${item.conmod}` : ''}
                ${item.magmod >= 0 ? `**Magic**: ${item.magmod}` : ''}
                ${item.sprmod >= 0 ? `**Spirit**: ${item.sprmod}` : ''}
                ${item.hpmod >= 0 ? `**HP**: ${item.hpmod}` : ''}
                ${item.mpmod >= 0 ? `**MP**: ${item.mpmod}` : ''}
                ${item.fishtimermod >= 0 ? `**Fish timer mod**: ${(1 - item.fishtimermod) * 100}%` : ''}
                ${item.gathertimermod >= 0 ? `**Gather timer mod**: ${(1 - item.gathertimermod) * 100}%` : ''}
                ${item.hunttimermod >= 0 ? `**Hunt timer mod**: ${(1 - item.hunttimermod) * 100}%` : ''}
                ${item.cost || item.sell ? `**Cost**: ${item.cost > 0 ? item.cost : 'unbuyable'}, **sell for**: ${item.sell}` : ''}
                `.split('\n').filter(l=>l.trim().length).join('\n'))
            return message.channel.send(embed);
        }
    }
}

module.exports = InformationCommand;