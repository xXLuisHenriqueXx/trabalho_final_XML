const fs = require("fs");
const path = require("path");

const saveOutputFile = (name, data) => {
  const dir = path.join(__dirname, "outputs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2));
};

module.exports = saveOutputFile;
