module.exports = (client) => {
  client.fish = async function(userid, messageTime) {
    let end = [];
    const xp = Math.floor(Math.random() * 4 + 1);
    const items = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    let query = `INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES `
    let params = [];

    for (const item of items) {
      if (item > .95) {
        const result = client.fishunc.random();
        const amt = Math.floor(Math.random() * 2 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
        }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
      if (item > .05) {
        const result = client.fishcom.random();
        const amt = Math.floor(Math.random() * 2 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
        }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
    }

    for (i = 0, k = 0; i < end.length; i += 3, k += 4) {
      if (i === end.length - 3) {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4})`
      }
      else {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4}), `
      }

      params.push(`${userid}-${end[i + 2]}`, userid, end[i + 2], end[i + 1]);
    }

    query += ` ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)`

    await client.db.query(`${query}`, params);
    await client.db.query(`
      UPDATE
        players
      SET
        fishtimer = $1,
        xp = (xp + $2)
      WHERE
        playerid = $3`,
      [messageTime, xp, userid]);

    return end;
  }

  client.gather = async function(userid, messageTime) {
    let end = [];
    const xp = Math.floor(Math.random() * 4 + 1);
    const items = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    let query = `INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES `
    let params = [];

    for (const item of items) {
      if (item > .95) {
        const result = client.gathunc.random();
        const amt = Math.floor(Math.random() * 2 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
        }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
      if (item > .05) {
        const result = client.gathcom.random();
        const amt = Math.floor(Math.random() * 2 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
          }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
    }

    for (i = 0, k = 0; i < end.length; i += 3, k += 4) {
      if (i === end.length - 3) {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4})`
      }
      else {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4}), `
      }

      params.push(`${userid}-${end[i + 2]}`, userid, end[i + 2], end[i + 1]);
    }

    query += ` ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)`

    await client.db.query(`${query}`, params);
    await client.db.query(`
      UPDATE
        players
      SET
        gathertimer = $1,
        xp = (xp + $2)
      WHERE
        playerid = $3`,
      [messageTime, xp, userid]);

    return end;
  }

  client.hunt = async function(userid, messageTime, gold) {
    let end = [];
    const xp = Math.floor(Math.random() * 2 + 1);
    const items = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    let query = `INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES `
    let params = [];

    for (const item of items) {
      if (item > .95) {
        const result = client.huntunc.random();
        const amt = Math.floor(Math.random() * 2 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
        }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
      else if (item > .10) {
        const result = client.huntcom.random();
        const amt = Math.floor(Math.random() * 4 + 1);
        if (end.indexOf(result.name) === -1) {
          end.push(result.name, amt, result.itemid);
        }
        else {
          end[end.indexOf(result.name) + 1] += amt;
        }
      }
    }

    for (i = 0, k = 0; i < end.length; i += 3, k += 4) {
      if (i === end.length - 3) {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4})`
      }
      else {
        query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4}), `
      }

      params.push(`${userid}-${end[i + 2]}`, userid, end[i + 2], end[i + 1]);
    }

    query += ` ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)`

    await client.db.query(`${query}`, params);
    await client.db.query(`
      UPDATE
        players
      SET
        hunttimer = $1,
        xp = (xp + $2),
        gold = (gold + $3)
      WHERE
        playerid = $4`,
      [messageTime, xp, gold, userid]);

    return end;
  }
}