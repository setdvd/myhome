import * as config from "config";
import {Client} from "pg";

const dbConfig = config.get("db");
console.log("migrate");
export const up = async (next: any) => {

    const client = new Client(dbConfig);
    await client.connect();
    try {
        await client.query(`CREATE SCHEMA general;`);
    } catch (e) {
        console.log("schema exists");
    }
    await client.query(`SET SEARCH_PATH TO general;`);
    await client.query(`
          CREATE TABLE IF NOT EXISTS t_sensor (
              id            serial primary key,
              description   text,
              created_at    timestamptz default now()
          );
    `);
    await client.query(`
        CREATE TABLE IF NOT EXISTS t_sensor_reading (
            id          serial primary key,
            value       smallint,
            sensor      int references t_sensor(id) on delete cascade,
            created_at  timestamptz default now()
        );
    `);
    await client.end();
    next();
};

export const down = async (next: any) => {
    const client = new Client(dbConfig);
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS general CASCADE;`);
    await client.end();
    next();
};
