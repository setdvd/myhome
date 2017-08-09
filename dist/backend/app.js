"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("config");
var Koa = require("koa");
var BodyParser = require("koa-bodyparser");
var Router = require("koa-router");
var pg_1 = require("pg");
var dbConfig = config.get("db");
var koa = new Koa();
var router = new Router();
var pool = new pg_1.Pool(dbConfig);
var bodyParser = BodyParser();
koa.use(function dbProvider(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx.db = pool;
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
router.post("/sensorReadings", bodyParser, function sensorReadingHandler(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, sensorId, value, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = ctx.request.body, sensorId = _a.sensorId, value = _a.value;
                    console.log(sensorId);
                    console.log(value);
                    return [4 /*yield*/, ctx.db.query("\n            insert into general.t_sensor_reading ( sensor, value)\n            values ($1,$2)", [sensorId, value])];
                case 1:
                    _b.sent();
                    ctx.status = 200;
                    ctx.body = "ok";
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _b.sent();
                    console.error(e_1.message);
                    ctx.status = 500;
                    ctx.body = e_1.message;
                    switch (e_1.code) {
                        case "23503":
                            ctx.status = 400;
                            ctx.body = "Incorrect sensor id";
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
koa.use(router.routes());
exports.default = koa;
//# sourceMappingURL=app.js.map