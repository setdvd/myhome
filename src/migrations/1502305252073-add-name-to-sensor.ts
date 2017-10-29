import db from "../lib/db";

type Next = () => void;

export const up = async (next: Next) => {
    const client = await db.connect();
    await client.query(`SET SEARCH_PATH TO general;`);

    try {
        await client.query(`
            alter table t_sensor
              add column name text;
        `);
    } catch (e) {
        console.log(e);
    }

    await client.end();
    next();
};

export const down = async (next: Next) => {
    const client = await db.connect();
    await client.query(`SET SEARCH_PATH TO general;`);
    await client.query(`
        alter table t_sensor
        drop column name restrict;
  `);

    await client.end();
    next();
};
