const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, callback) => {
    if (file.mimetype === "text/xml" || file.mimetype === "application/xml") {
      callback(null, true);
    } else {
      callback(new Error("Apenas arquivos XML são permitidos."));
    }
  },
});

module.exports = upload;
