const { Command } = require('discord-akairo');

class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix', 'pr'],
            channel: 'guild',
            category: 'utility',
            description: {
                content: 'Shows a list of current prefixes for this guild.',
                usage: 'prefix',
                example: 'prefix'
            }
        })
    }

    async exec(message) {
        const prefixList = this.client.guildSettings.get(message.guild.id).prefix.join('` - `');
        return message.channel.send('Current prefixes are: `' + prefixList + '`');
    }
}

module.exports = PrefixCommand;