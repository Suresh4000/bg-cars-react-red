import "dotenv/config";
import app from "./app.js";

const port = Number.parseInt(process.env.PORT ?? "4000", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port between 1 and 65535.");
}
app.listen(port, () => console.log("Bay View GMS API listening on port " + port));
