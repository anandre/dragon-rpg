const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'utility',
            description: {
                content: 'List of commands and syntax',
                usage: '[command]',
                example: 'help [start]'
            },
            args: [
                {
                    id: 'commandName'
                }
            ]
        })
    }

    async exec(message, args) {
        if (!args.commandName) {
            try {
                const embed = new MessageEmbed()
                .setColor('GREY')
                .addField('Commands', 'For additional information on a command, use `help [command]`\n`()` is required, `[]` is optional, `|` denotes different options for the parameter')
                .addField('RPG Commands', this.client.commandHandler.modules.filter(c => c.categoryID === 'rpg').sort((a, b) => a.id - b.id).map(c => `\`${c.id}\``).join(' '))
                .addField('Utility/Setup Commands', this.client.commandHandler.modules.filter(c => c.categoryID === 'utility').map(c => `\`${c.id}\``).join(' '))
                message.channel.send(embed)
            }
            catch (e) {
                message.channel.send(`${e.stack}`)
            }
        }
        else if (this.client.commandHandler.modules.has(args.commandName.toLowerCase())) {
            try {
                const command = this.client.commandHandler.modules.get(args.commandName.toLowerCase())
                console.log(command)
                const embed = new MessageEmbed()
                .setColor('GREY')
                .addField(`${args.commandName.charAt(0).toUpperCase()}${args.commandName.substr(1).toLowerCase()}`, `${command.description.content}
                **Aliases**: ${command.aliases.join(', ')}
                **Syntax**: ${command.description.usage}
                **Example** ${command.description.example}`)
                message.channel.send(embed);
                //expert paddle swordfish seeds
            }
            catch (e) {
                message.channel.send(e.stack, {code: 'xxl'})
            }
        }
    }
}

module.exports = HelpCommand;