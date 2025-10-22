const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao conectar ao banco:", err);
  else console.log("Banco de dados SQLite conectado.");
});

const initDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS xml_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      xml TEXT,
      json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Banco de dados SQLite conectado.");
};

module.exports = { db, initDatabase };
