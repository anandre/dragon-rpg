const { Command } = require('discord-akairo');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class UseCommand extends Command {
  constructor() {
    super('use', {
      aliases: ['use', 'u'],
      category: 'rpg',
      channel: 'guild',
      description: {
        content: 'Use a consumable to restore HP, MP or cure statuses, among other uses.',
        usage: 'use <item>',
        example: 'use potion\nuse elixir'
      }
    });
  }

  async *args() {
    const item = yield {
      match: 'content'
    };

    return { item };
  }

  async exec(message, { item }) {
    const used = dataManager.items.get(item) || dataManager.items.find(i => i.name === item);
    if (!used) {
      return message.answer(message.author, 'there is no such item!');
    }
    const inventory =
  }
}

module.exports = UseCommand;