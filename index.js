const { server } = require("./src/app")
const db = require("./src/db/connect")

server.listen(8050)

db.on("open", () => console.log("db open"))