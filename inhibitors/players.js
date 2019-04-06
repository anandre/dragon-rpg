const { Inhibitor } = require('discord-akairo');

class PlayersInhibitor extends Inhibitor {
    constructor() {
        super('players', {
            reason: 'user does not have a character'
        })
    }

    exec(message, command) {
        const blockedCommands = ['hunt', 'gather', 'fish', 'inventory'];
        const blacklist = this.client.players;
        return blockedCommands.includes(command.id) && !blacklist.includes(message.author.id);
    }
}

module.exports = PlayersInhibitor;