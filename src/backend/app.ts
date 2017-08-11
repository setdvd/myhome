import * as config from "config";
import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as pg from "pg";
import {inject as pgCamelCase} from "pg-camelcase";
import graphql from "./graphql";

// Patch pg to user camel case;
pgCamelCase(pg);

const {Pool}     = pg;
const dbConfig   = config.get("db");
const koa        = new Koa();
const router     = new Router();
const pool       = new Pool(dbConfig);
const bodyParser = BodyParser();

declare module "koa" {
    //noinspection TsLint
    export interface Context {
        db: pg.Pool;
    }
}

koa.use(async function logger(ctx, next) {
    console.log("request");
    await next();
    console.log(`status ${ctx.status}`);
});

koa.use(async function dbProvider(ctx, next) {
    ctx.db = pool;
    await next();
});

koa.use(graphql);

router.get("/sensorReadings", bodyParser, async function sensorReadingHandler(ctx, next) {
    try {
        const {
                  sensorId,
                  value,
              } = ctx.request.body;
        console.log(sensorId);
        console.log(value);
        await ctx.db.query(`
            insert into general.t_sensor_reading (sensor, value)
            values ($1, $2)`,
            [sensorId, value]);
        ctx.status = 200;
        ctx.body   = "ok";
    } catch (e) {
        console.error(e.message);
        ctx.status = 500;
        ctx.body   = e.message;
        switch (e.code) {
            case "23503":
                ctx.status = 400;
                ctx.body   = "Incorrect sensor id";
        }
    }

});

koa.use(router.routes());

export default koa;
