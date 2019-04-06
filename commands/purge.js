const { Command } = require('discord-akairo');

class PurgeCommand extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge'],
            args: [{
                id: 'number',
                type: 'number',
                default: 5
            }],
            ownerOnly: true,
            category: 'owner'
        })
    }

    async exec(message, args) {
        message.channel.bulkDelete(args.number);
    }
}

module.exports = PurgeCommand;