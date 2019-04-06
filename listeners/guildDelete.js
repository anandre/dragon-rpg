const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class GuildDeleteListener extends Listener{
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    async exec(guild) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(`Left ${guild.name} (id: ${guild.id}) at ${new Date().toLocaleString()}`)
        this.client.channels.get('550762593443250186').send(embed);
    }
}

module.exports = GuildDeleteListener;