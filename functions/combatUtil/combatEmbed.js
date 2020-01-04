const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const combatEmbed = (combat) => {
  const players = combat.filter(f => f.side === 'player');
  const monsters = combat.filter(f => f.side === 'monster');
  const embed = new MessageEmbed()
    .setTitle(`Combat - Turn ${combat.find(t => t.constructor.name === 'Number')}`)
    .setDescription(players.map(f => oneLine`**${f.name}** - ❤ HP: ${f.currHP}/${f.maxHP} 
    ✨ MP: ${f.currMP}/${f.maxMP} 
    💥 Abilities: ${f.abilities.map(a =>
    `${a.name} ${a.cooldown === dataManager.abilities.get(a.name).cooldown ? '' : `${a.cooldown + 1}`}
    `).join(', ')}`).join('\n') + '\n');
  for (const monster of monsters) {
    embed.description += `\n**${monster.name}** (${monster.id}) - ❤ HP: ${monster.currHP}/${monster.maxHP}  ✨ MP: ${monster.currMP}/${monster.maxMP}`;
  }
  return embed;
};

module.exports = combatEmbed;