const express = require("express");
const { sequelize } = require("./app/config/db.config.js");
const app = express();

const db = require("./app/config/db.config.js");

global.__basedir = __dirname;

// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync with { force: true }");
});

let router = require("./app/routers/excel.router.js");
app.use(express.static("resources"));
app.use("/", router);

app.get("/voters", (req, res) => {
  console.log("inside");
  let sql = "SELECT * FROM voters";
  let query = sequelize.query(sql, (err, results) => {
    console.log(query);
    if (err) throw err;
    console.log(results);
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// Create a Server
const server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
