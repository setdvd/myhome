import * as config from "config";
import app from "./app";

const PORT = config.get("port");

app.listen(PORT, () => {
    console.log(`Server is listen on ${PORT}`);
});

