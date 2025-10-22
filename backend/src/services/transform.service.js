const saveOutputFile = require("../helper/saveOutputFile.helper");
const extractProducts = require("../helper/extractProducts.helper");

const generateJSON = (id, json) => {
  saveOutputFile(`nf_${id}.json`, json);
};

const generateProductsNF = (id, inf) => {
  const products = extractProducts(inf);

  saveOutputFile(`nf_${id}_produtos.json`, products);
};

const generateAllProducts = (rows) => {
  let all = [];
  for (const r of rows) {
    const nfe = JSON.parse(r.json);
    const inf = nfe.nfeProc?.NFe?.infNFe;

    all.push(...extractProducts(inf));
  }

  saveOutputFile(`todos_produtos.json`, all);
};

const generateProductsByNFOrder = (id, inf) => {
  const ord = extractProducts(inf).sort((a, b) =>
    a.xProd.localeCompare(b.xProd)
  );

  saveOutputFile(`nf_${id}_produtos_ordenados.json`, ord);
};

const generateAllProductsOrdered = (rows) => {
  let refNF = null;
  let all = [];

  for (const r of rows) {
    const nfe = JSON.parse(r.json);
    const inf = nfe.nfeProc?.NFe?.infNFe;
    if (!refNF) refNF = inf;

    all.push(...extractProducts(inf));
  }

  all.sort((a, b) => parseFloat(a.vProd || 0) - parseFloat(b.vProd || 0));

  saveOutputFile(`produtos_todas_notas_ordenados.json`, all);
};

module.exports = {
  generateJSON,
  generateProductsNF,
  generateAllProducts,
  generateProductsByNFOrder,
  generateAllProductsOrdered,
};
