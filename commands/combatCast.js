const { Command } = requre('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

class CastCommand extends Command {
    constructor() {
        super('cast', {
            aliases: ['ability', 'abi', 'cast'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Use an ability in combat.',
                usage: 'ability (name) [target]',
                example: 'ability rush'
            },
            args: [
                {
                    id: 'ability',
                    type: 'string'
                },
                {
                    id: 'target',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }

    async exec(message, { ability, target }) {
        console.log('cast');
        if (!this.client.combat.has(message.author.id)) return;
        if (!this.client.combat.get(message.author.id).abilities.includes(ability)) return message.channel.send(`${message.author.username}, unknown ability, please try again.`);
        const usedAbility = this.client.abilities.get(ability);
        const player = this.client.combat.get(message.author.id);
        const cooldown = player.cooldowns[player.abilities.indexOf(ability)]
        console.log(cooldown);
        if (cooldown === usedAbility.cooldown) { //ability can be used
            
        }

    }
}

module.exports = CastCommand;