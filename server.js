const express = require("express");
const { sequelize } = require("./app/config/db.config.js");
const app = express();
const cors = require("cors");
const db = require("./app/config/db.config.js");
var mysql = require("mysql");
const voter = (global.__basedir = __dirname);
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync with { force: true }");
// });

let router = require("./app/routers/excel.router.js");
app.use(express.static("resources"));
app.use("/", router);
app.use(cors);
// app.get("/voters", (req, res) => {
//   console.log("inside");
//   // let sql = "SELECT * FROM voters";
//   // let query = sequelize.query(sql, (err, results) => {
//   //   console.log(query);
//   //   if (err) throw err;
//   //   console.log(results);
//   //   res.send(JSON.stringify({ status: 200, error: null, response: results }));
//   // });
// });
// app.get("/voters1", function (req, res) {
//   console.log("hey");
//   // res.send("GET request to the homepage");
//   // var sql = "SELECT * FROM voters";
//   // db.query(sql, function (err, data, fields) {
//   //   if (err) throw err;
//   //   // res.render("user-list", { title: "User List", userData: data });
//   // });
//   res.send("data");
// // });
// app.get("/voters", (req, res) => {
//   con.connect(function (err) {
//     if (err) throw err;
//     db.query("SELECT * FROM voters", function (err, result, fields) {
//       if (err) throw err;
//       console.log("result", result);
//       res.send(result);
//     });
//   });
// });

// Create a Server
const server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
