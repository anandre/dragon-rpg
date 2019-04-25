const { Command } = require('discord-akairo');

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev', 'e'],
            ownerOnly: true,
            category: 'owner',
            args: [
                {
                    id: 'code',
                    match: 'content'
                }
            ]
        })
    }

    async exec(message, args) {
        try {
            const evaled = eval(args.code);
            const clean = await message.client.clean(message.client, evaled)
            message.channel.send(clean, {code: 'xl'});
        }
        catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await message.client.clean(message.client, err.message.substr(0, 1900))}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand;