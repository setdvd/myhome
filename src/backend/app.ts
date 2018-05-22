import * as fs from "fs";
import * as Koa from "koa";
import * as Router from "koa-router";
import {devMiddleware} from "koa-webpack-middleware";
import * as cors from "koa2-cors";
import * as path from "path";
import {Pool} from "pg";
import * as webpack from "webpack";
import pool from "../lib/db";
import webpackConfig = require("../webpack.config.js");
import graphql from "./graphql";

const compile    = webpack(webpackConfig as any);
const koa        = new Koa();
const router     = new Router();
const assetPath  = "/assets/bundle.js";
const {NODE_ENV} = process.env;
const isProd     = NODE_ENV === "production";

declare module "koa" {
    //noinspection TsLint
    export interface Context {
        db: Pool;
    }
}
koa.use(cors({
    allowHeaders: ["Origin", "Accept", "Content-Type", "Content-Length"],
    credentials: true,
}));

koa.use(async function logger(ctx, next) {
    console.log(`request `, ctx.headers, ctx.request);
    await next();
    console.log(`request status ${ctx.status}`);
});

koa.use(async function dbProvider(ctx, next) {
    ctx.db = pool;
    await next();
});

koa.use(graphql);

// if (isProd) {
//     router.get(assetPath, async function sendBundle(ctx, next) {
//         ctx.status = 200;
//         ctx.body   = fs.createReadStream(path.join(__dirname, "../../dist/bundle.js"));
//         await next();
//     });
// } else {
//     // webpack in not prod env;
//     router.use(devMiddleware(compile, {
//         // display no info to console (only warnings and errors)
//         noInfo: false,
//
//         // display nothing to the console
//         quiet: false,
//
//         // switch into lazy mode
//         // that means no watching, but recompilation on every request
//         lazy: false,
//
//         // watch options (only lazy: false)
//         watchOptions: {
//             aggregateTimeout: 300,
//             poll            : false,
//         },
//
//         // public path to bind the middleware to
//         // use the same as in webpack
//         publicPath: "/assets/",
//
//         // custom headers
//         // headers: { "X-Custom-Header": "yes" },
//
//         // options for formating the statistics
//         stats: {
//             colors: true,
//         },
//     }));
// }

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
