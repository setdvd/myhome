import * as fs from "fs";
import * as path from "path";

const schema = fs.readFileSync(path.join(__dirname, "./schema.graphql"), "utf8");

export default schema;
