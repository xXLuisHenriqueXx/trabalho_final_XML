const upload = require("../config/multer");
const validateNFE = require("../config/ajv");
const { parseXML } = require("../services/xml.service");
const { saveXML } = require("../services/database.service");
const {
  generateJSON,
  generateProductsNF,
  generateProductsByNFOrder,
  generateAllProducts,
  generateAllProductsOrdered,
} = require("../services/transform.service");
const { db } = require("../config/database");

const analyzeController = {
  uploadAndAnalyze: (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      try {
        if (!req.file) throw new Error("Nenhum arquivo enviado.");

        const { xml, json } = await parseXML(req.file.buffer);
        if (!validateNFE(json))
          return res
            .status(400)
            .json({ error: "Schema inválido", details: validateNFE.errors });

        const id = await saveXML(req.file.originalname, xml, json);

        const inf = json.nfeProc?.NFe?.infNFe;

        generateJSON(id, json);
        generateProductsNF(id, inf);
        generateProductsByNFOrder(id, inf);

        db.all(`SELECT id, json FROM xml_files`, [], (_, rows) => {
          generateAllProducts(rows);
          generateAllProductsOrdered(rows);
        });

        res.status(201).json({ message: "XML processado e salvo.", id, json });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  },
};

module.exports = analyzeController;
