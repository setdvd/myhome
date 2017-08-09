import * as config from "config";
import {Client} from "pg";

const dbConfig = config.get("db");

export const up = async (next)=>{
  const db =  new Client(dbConfig);
  await db.connect();
  await db.query(`SET SEARCH_PATH TO general;`);

  await db.query(`
    alter table t_sensor
      add column name text;
  `);

  await db.end();
  next();
};

export const down = async (next)=>{
const db =  new Client(dbConfig);
  await db.connect();
  await db.query(`SET SEARCH_PATH TO general;`);

  await db.query(`
    alter table t_sensor
      drop column name restrict;
  `);

  await db.end();
  next();
};


