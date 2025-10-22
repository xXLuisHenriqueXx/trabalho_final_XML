const extractNFInfo = (json) => {
  return json.nfeProc?.NFe?.infNFe || null;
};

const buildProducts = (detArray) => {
  const arr = Array.isArray(detArray) ? detArray : [detArray];
  return arr.map((item) => {
    const prod = item.prod || {};
    const tax = item.imposto || {};

    const icms = parseFloat(
      tax?.ICMS?.[Object.keys(tax.ICMS || {})[0]]?.vICMS || 0
    );
    const ipi = parseFloat(tax?.IPI?.IPITrib?.vIPI || 0);
    const pis = parseFloat(tax?.PIS?.PISAliq?.vPIS || 0);
    const cofins = parseFloat(tax?.COFINS?.COFINSAliq?.vCOFINS || 0);
    const total = icms + ipi + pis + cofins;

    return {
      number: item.nItem,
      code: prod.cProd,
      name: prod.xProd,
      value: parseFloat(prod.vProd || 0),
      taxes: { ICMS: icms, IPI: ipi, PIS: pis, COFINS: cofins, total },
    };
  });
};

module.exports = {
  extractNFInfo,
  buildProducts,
};
