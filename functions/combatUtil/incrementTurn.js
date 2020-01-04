/* eslint-disable indent */
const { oneLine } = require('common-tags');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const incrementTurn = (combat, attacks) => {
  combat[combat.findIndex(t => t.constructor.name === 'Number')]++;
  // add statuses to message
  // add status effects to beginning of turn
  let nextInitMessage = '';
  let statusDurMessage = '';
  let statusEffMessage = '';
  for (const fighter of combat.filter(i => i.init && i.currHP > 0)) {
    for (const ability of fighter.abilities) {
      // add abilities for existing enemies
      const regAbility = dataManager.abilities.get(ability.name);
      if (ability.cooldown < regAbility.cooldown) {
        ability.cooldown--;
        if (ability.cooldown === -1) ability.cooldown = regAbility.cooldown;
      }
    }
    if (fighter.statuses.length > 0) {
      for (const status of fighter.statuses) {
        status.duration--;
        const eff = status.effect(fighter);
        statusEffMessage += eff;
        if (status.duration === 0) {
          const index = fighter.statuses.findIndex(s => s.name === status.name);
          fighter.statuses.splice(index, 1);
        }
      }
      if (fighter.statuses.length > 0) {
        statusDurMessage += oneLine`**${fighter.side === 'monster' ? fighter.id : fighter.name}**: 
        ${fighter.statuses.map(s =>
          `**${s.name}** (${s.duration})`
        )}`;
      }
    }
  }
  const nextEmbed = dataManager.functions.combatEmbed(combat);
  const nextInit = dataManager.functions.generateInit(combat);
  for (const fighter of nextInit.filter(f => f.init && f.currHP > 0)) {
    nextInitMessage += `**${fighter.side === 'monster' ? fighter.id : fighter.name} Init**: ${fighter.init}\n`;
  }
  nextEmbed.description = statusDurMessage + '\n\n' + statusEffMessage + '\n' + attacks.join('\n') + `\n\n${nextEmbed.description}`;
  nextEmbed.description += `\n\n${nextInitMessage}`;
  return nextEmbed;
};

module.exports = incrementTurn;