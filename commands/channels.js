const { Command } = require('discord-akairo');

class ChannelsCommand extends Command {
    constructor() {
        super('channels', {
            aliases: ['channels', 'ch'],
            channel: 'guild',
            category: 'utility',
            description: {
                content: 'Shows the list of channels commands can be used in.  Does not apply to `channels`, `setchannel`, or `help` commands.',
                usage: 'channels',
                example: 'channels'
            }
        })
    }

    async exec(message) {
        const channelList = this.client.guildSettings.get(message.guild.id).channel.join('> - <#')
        message.channel.send('Permitted channels: <#' + channelList + '>')
    }
}

module.exports = ChannelsCommand;