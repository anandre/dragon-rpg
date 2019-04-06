module.exports = (client) => {
    client.playerAttack = async (player, weapon, enemy) => {
        const playerDmgDice = weapon.weapondice.split(' + ')[0].split('d');
        const playerDmgAdd = weapon.weapondice.split(' + ')[1].split(' * ');
        
        const playerObject = {
            p: enemy.physdef,
            m: enemy.magdef,
            STR: player.str,
            AGI: player.agi,
            MAG: player.mag,
            SPR: player.spr
        };
        
        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(playerDmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(playerDmgDice[1]) + 1);
        };
        const addDmg = parseInt(playerDmgAdd[0]) * playerObject[playerDmgAdd[1]];
        const playerRawDmg = rawDmg + addDmg;
        const playerNetDmg = playerRawDmg - playerObject[weapon.damagetype];
        if (playerNetDmg < 1) { 
            player.enemyhp -= 1;
            return 1;
        }
        player.enemyhp -= playerNetDmg;
        return playerNetDmg;
    };

    client.enemyBasicAttack = async (enemy, player) => {
        const enemyDmgDice = enemy.damage.split(' + ')[0].split('d');
        const enemyDmgAdd = enemy.damage.split( ' + ')[1].split(' * ');

        const enemyObject = {
            p: player.physdef,
            m: player.magdef,
            STR: enemy.str,
            AGI: enemy.agi,
            MAG: enemy.mag,
            SPR: enemy.spr
        };

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(enemyDmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(enemyDmgDice[1]));
        };
        const addDmg = parseInt(enemyDmgAdd[0]) * enemyObject[enemyDmgAdd[1]];
        const enemyRawDmg = rawDmg + addDmg;
        const enemyNetDmg = enemyRawDmg - enemyObject[enemy.damagetype];
        if (enemyNetDmg < 1) {
            player.currhp -= 1;
            return 1;
        }
        player.currhp -= enemyNetDmg;
        return enemyNetDmg;
    };

    client.castAttackSingle = async (attacker, defender, ability) => {
        const dmgDice = ability.damage.split(' + ')[0];
        const dmgAdd = ability.damage.split(' + ')[1];
        const type = {
            p: defender.physdef,
            m: defender.magdef,
            STR: attacker.str,
            AGI: attacker.agi,
            MAG: attacker.mag,
            SPR: attacker.spr
        };

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(dmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
        };
        const addDmg = parseInt(dmgAdd[0] * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        const netDmg = grossDmg - type[ability.damagetype];
        return Math.max(1, netDmg)
    }
}