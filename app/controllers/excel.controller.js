var stream = require("stream");
var await = require("await");

const db = require("../config/db.config.js");
const Voter = db.Voter;

const excel = require("exceljs");

const readXlsxFile = require("read-excel-file/node");
const { rootCertificates } = require("tls");

exports.uploadFile = (req, res) => {
  try {
    let filePath = __basedir + "/uploads/" + req.file.filename;

    readXlsxFile(filePath).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      console.log(rows);

      // Remove Header ROW
      rows.shift();

      const voters = [];

      let length = rows.length;

      for (let i = 0; i < length; i++) {
        let voter = {
          id: rows[i][0],
          name: rows[i][1],
          address: rows[i][2],
          age: rows[i][3],
          Idnumber: rows[i][4],
          privatekey: rows[i][7],
          Status: rows[i][5],
          accountaddress: rows[i][6],
        };

        voters.push(voter);
      }

      Voter.bulkCreate(voters).then(() => {
        const result = {
          status: "ok",
          filename: req.file.originalname,
          message: "Upload Successfully!",
        };

        res.json(result);
      });
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    res.json(result);
  }
};

/**
 * Upload multiple Excel Files
 *
 * @param {*} req
 * @param {*} res
 */
exports.uploadMultipleFiles = async (req, res) => {
  const messages = [];

  for (const file of req.files) {
    try {
      let filePath = __basedir + "/uploads/" + file.filename;
      let rows = await readXlsxFile(filePath);

      // `rows` is an array of rows
      // each row being an array of cells.
      console.log(rows);

      // Remove Header ROW
      rows.shift();

      const voters = [];

      let length = rows.length;

      for (let i = 0; i < length; i++) {
        let voter = {
          id: rows[i][0],
          name: rows[i][1],
          address: rows[i][2],
          age: rows[i][3],
          Idnumber: rows[i][4],
          privatekey: rows[i][7],
          Status: rows[i][5],
          accountaddress: rows[i][6],
        };

        voters.push(voter);
      }

      uploadResult = await Voter.bulkCreate(voters);

      // It will now wait for above Promise to be fulfilled and show the proper details
      console.log(uploadResult);

      if (!uploadResult) {
        const result = {
          status: "fail",
          filename: file.originalname,
          message: "Can NOT upload Successfully",
        };

        messages.push(result);
      } else {
        const result = {
          status: "ok",
          filename: file.originalname,
          message: "Upload Successfully!",
        };
        messages.push(result);
      }
    } catch (error) {
      const result = {
        status: "fail",
        filename: file.originalname,
        message: "Error -> " + error.message,
      };

      messages.push(result);
    }
  }

  return res.json(messages);
};

exports.downloadFile = (req, res) => {
  Voter.findAll().then((objects) => {
    var voters = [];
    let length = objects.length;

    for (let i = 0; i < length; i++) {
      let datavalues = objects[i].dataValues;
      let voter = {
        id: datavalues.id,
        name: datavalues.name,
        address: datavalues.address,
        age: datavalues.age,
        privatekey: datavalues.privatekey,
        accountaddress: datavalues.accountaddress,
        Status: datavalues.Status,
        Idnumber: datavalues.Idnumber,
      };
      voters.push(voter);
    }

    console.log(voters);

    const jsonVoters = JSON.parse(JSON.stringify(voters));

    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet("Voters"); //creating worksheet

    worksheet.columns = [
      { header: "Id", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Address", key: "address", width: 30 },
      { header: "PrivateKey", key: "privatekey", width: 30 },
      { header: "AccountAddress", key: "accountaddress", width: 30 },
      { header: "IdNumber", key: "Idnumber", width: 30 },
      { header: "Status", key: "Status", width: 30 },
      { header: "Age", key: "age", width: 10, outlineLevel: 1 },
    ];

    // Add Array Rows
    worksheet.addRows(jsonVoters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "voter.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};
