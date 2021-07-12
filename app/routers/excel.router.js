let express = require("express");
let router = express.Router();
let upload = require("../config/multer.config.js");

const excelWorker = require("../controllers/excel.controller.js");
let path = __basedir + "/views/";

router.get("/", (req, res) => {
  console.log("__basedir" + __basedir);
  res.sendFile(path + "index.html");
});
router.get("/voters", excelWorker.findAll);
router.post("/api/file/upload", upload.single("file"), excelWorker.uploadFile);
router.post(
  "/api/file/multiple/upload",
  upload.array("files", 4),
  excelWorker.uploadMultipleFiles
);
// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// router.all("/", excelWorker.all);
router.get("/api/file", excelWorker.downloadFile);

module.exports = router;
