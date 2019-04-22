const { Command } = require('discord-akairo');

class GiveCommand extends Command {
    constructor() {
        super('give', {
            aliases: ['give'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Gives a specified item or amount of gold to another player.',
                usage: 'give (user) (item | gold)',
                example: 'give `@user` irondagger\ngive `@user` 450g'
            }
        })
    }

    async *args(message, parsed, state) {
        const recip = yield {
            type: 'user',
            default: message => messagee.author
        }

        const give = yield {
            type: 'string',
            match: 'rest'
        }

        console.log(give);

        return { recip, give };
    }

    async exec(message, { recip, give }) {
        console.log('give');
        if (!this.client.players.includes(message.author.id) || recip.id === message.author.id) return message.channel.send(`${message.author.username}, you cannot give an item to that player.`);
        
        const item = this.client.infoItems.find(i => i.id === give) || this.client.infoItems.find(i => i.name === give);
        if (!item) {
            if (give.match(/\b[0-9]*(?=g)/)) { //gold instead
                const gold = parseInt(give.match(/\b[0-9]*(?=g)/)[0]);
            }
            else {
                return message.channel.send(`${message.author.username}, that is not a valid item to give.`);
            }
        }

        if (item) {

        }
    }
}

module.exports = GiveCommand;