"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("config");
var app_1 = require("./app");
var PORT = config.get("port");
app_1.default.listen(PORT, function () {
    console.log("Server is listen on " + PORT);
});
//# sourceMappingURL=server.js.map