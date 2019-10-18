module.exports = (client) => {
  client.promptTest = async (thisCombat) => {
    let pAttacks = [];
    for (const fighter of thisCombat) {
      if (fighter.side === 'player') {
        if (fighter.currHP > 0) {
          const mess = { author: { id: fighter.target }}
          const comm = client.commandHandler.modules.get('sCPrompt');
          pAttacks.push(client.commandHandler.runCommand(mess, comm))
        }
      }
      else {
        if (fighter.currHP > 0) {
          const players = thisCombat.filter(f => f.side === 'player');
          const targ = players[Math.floor(Math.random() * players.length)].playerid
          pAttacks.push(Promise.resolve(`${fighter.target} attack ${targ}`));
        }
      }
    }
    const round = await Promise.all(pAttacks);
    console.log(round);
    /*const roundAttacks = round.map(r => r.constructor.name === 'Collection' ? `${r.first().author.id} ${r.first().content.split(' ').slice(0, 2).join(' ')}`.split(' ') : r.split(' '));
    //console.log(roundAttacks);
    const res = [];
    for (const choice of roundAttacks) {
      const attacker = thisCombat.find(a => a.target === choice[0]);
      const defender = thisCombat.find(d => d.target === choice[2]);
      //fix attack to start working with hit/miss/crit rolls in order
      const choiceObj = {
        attack: client.attack(attacker, defender, attacker.statuses, defender.statuses)
      }
      const action = choiceObj[choice[1]];
      res.push(action)
    }
    return res;*/
  }
}