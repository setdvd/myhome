import * as pg from "pg";
import {inject as pgCamelCase} from "pg-camelcase";
import * as url from "url";

// Patch pg to user camel case;
pgCamelCase(pg);

const {DATABASE_URL} = process.env;
if (!DATABASE_URL) {
    throw new Error("You should provide DATABASE_URL env var");
}

const params = url.parse(DATABASE_URL);
if (!params || !params.auth || !params.pathname) {
    throw new Error("Not valid DATABASE_URL string");
}
const auth   = params.auth.split(":");
const config = {
    database: params.pathname.split("/")[1],
    host    : params.hostname,
    password: auth[1],
    port    : parseInt(params.port || "5432", 10),
    user    : auth[0],
};

const {Pool} = pg;

export default new Pool(config)
