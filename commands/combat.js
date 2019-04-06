const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class CombatCommand extends Command {
    constructor() {
        super('combat', {
            aliases: ['combat', 'com', 'fight'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Check your combat status, or use a combat command.  If used to continue combat and no target is provided, it will default to the first enemy.',
                usage: 'combat (status | attack | defend | cast | use) [target]',
                example: 'combat attack 1'
            },
            args: [
                {
                    id: 'comm',
                    type: ['status', 'attack', 'cast', 'defend', 'use']
                },
                {
                    id: 'target',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }

    async exec(message, { comm, target }) {
        console.log(comm);
        if (!comm) {
            return message.reply('please use a valid combat command! `status`, `attack`, `cast`, `defend`, or `use`.')
        }
        else {
            const commandObj = {
                status: 'combatstatus',
                attack: 'attack',
                cast: 'cast',
                defend: 'combatdefend',
                use: 'combatuse'
            }[comm]
            console.log(commandObj);
            const command = this.client.commandHandler.modules.get(commandObj);
            return this.client.commandHandler.handleDirectCommand(message, target, command);
        }
    }
}

module.exports = CombatCommand;