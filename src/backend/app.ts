import * as config from "config";
import * as fs from "fs";
import * as Koa from "koa";
import * as BodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as path from "path";
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
const assetPath  = "/assets/bundle.js";

declare module "koa" {
    //noinspection TsLint
    export interface Context {
        db: pg.Pool;
    }
}

koa.use(async function logger(ctx, next) {
    await next();
    console.log(`request status ${ctx.status}`);
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

    await next();

});

router.get(assetPath, async function sendBundle(ctx, next) {
    ctx.status = 200;
    ctx.body   = fs.createReadStream(path.join(__dirname, "../../dist/bundle.js"));
    await next();
});

router.get("/*", async function mainHTMLPage(ctx, next) {
    if (!ctx.body) {
        ctx.status = 200;
        ctx.body   = `
		<!DOCTYPE html>
		<html>
		<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500&subset=latin,cyrillic' rel='stylesheet' type='text/css' />
				<style>
					body, html, #app {
						margin:0;
						padding:0;
						height:100%;
						font-family:'Roboto';
						cursor: default;
					}
					#app {
						display: flex;
                        flex-direction: column;
                        background-color:#f2f2f2;
					}
				</style>
			</head>
			<body>
				<div id="app"></div>
                <script src="${assetPath}"></script>
			</body>
		</html>
	`;
    }
    await next();
});

koa.use(router.routes());

export default koa;
