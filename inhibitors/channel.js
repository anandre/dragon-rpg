const { Inhibitor } = require('discord-akairo');

class ChannelInhibitor extends Inhibitor {
    constructor() {
        super('chanInhib', {
            reason: 'tried to use a command outside of channel settings'
        })
    }

    exec(message, command) {
        console.log('inhib testing')
        if (['help', 'channels', 'setchannel'].includes(command.id)) return false;
        if (!message.guild) return false;
        console.log(this.client.guildSettings.get(message.guild.id).channel.length === 0)
        if (this.client.guildSettings.get(message.guild.id).channel.length === 0) return false;
        else if (this.client.guildSettings.get(message.guild.id).channel.includes(message.channel.id)) {
            return false;
        }
        return true;
    }
}

module.exports = ChannelInhibitor;