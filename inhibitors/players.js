const { Inhibitor } = require('discord-akairo');

class PlayersInhibitor extends Inhibitor {
	constructor() {
		super('players', {
			reason: 'user does not have a character'
		});
	}

	exec(message, command) {
		const blockedCommands = this.client.commandHandler.modules.filter(x => x.categoryID === 'rpg' && x.id != 'start').map(x => x.id);
		const blacklist = this.client.players;
		if (blockedCommands.includes(command.id) && !blacklist.includes(message.author.id)) {
			return message.answer(message.author, 'you need to join the game first!  Use the `start` command to join!');
		}
		return blockedCommands.includes(command.id) && !blacklist.includes(message.author.id);
	}
}

module.exports = PlayersInhibitor;