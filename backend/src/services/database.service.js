const { db } = require("../config/database");

const saveXML = async (filename, xml, json) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO xml_files (filename, xml, json) VALUES (?, ?, ?)`,
      [filename, xml, JSON.stringify(json)],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getAllXML = async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM xml_files`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = { saveXML, getAllXML };
