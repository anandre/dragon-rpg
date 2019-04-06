const { Command } = require('discord-akairo');

class LoadCommand extends Command {
    constructor() {
        super('load', {
            aliases: ['load'],
            ownerOnly: true,
            category: 'owner',
            args: [
                {
                    id: 'commandName'
                }
            ]
        })
    }

    async exec(message, args) {
        try {
            this.client.commandHandler.load(`./commands/${args.commandName}.js`)
            message.channel.send(`${args.commandName} successfully loaded.`)
        }
        catch (e) {
            message.channel.send(`${e.message}
            ${e.stack}`, {code: 'xxl'})
        }
    }
}

module.exports = LoadCommand;