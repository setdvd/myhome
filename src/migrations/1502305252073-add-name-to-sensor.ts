import * as config from "config";
import {Client} from "pg";

const dbConfig = config.get("db");

type Next = () => void;

export const up = async (next: Next) => {
    const db = new Client(dbConfig);
    await db.connect();
    await db.query(`SET SEARCH_PATH TO general;`);

    try {
        await db.query(`
            alter table t_sensor
              add column name text;
        `);
    } catch (e) {
        console.log(e);
    }

    await db.end();
    next();
};

export const down = async (next: Next) => {
    const db = new Client(dbConfig);
    await db.connect();
    await db.query(`SET SEARCH_PATH TO general;`);

    await db.query(`
        alter table t_sensor
        drop column name restrict;
  `);

    await db.end();
    next();
};
