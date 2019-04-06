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
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await message.client.clean(message.client, err)}\n\`\`\``);
        }
        //let evaled = eval(args.code);

        //this if was originally not in the code to produce the screenshot, it was an attempt after
        //if (evaled.constructor.name === 'Promise') {
        //    evaled = await evaled
        //}
 
        //if (typeof evaled !== "string")
        //evaled = require("util").inspect(evaled);
 
      //return message.channel.send(message.client.clean(evaled), {code:"xl"});
    }
}

module.exports = EvalCommand;