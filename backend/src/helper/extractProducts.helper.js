const extractProducts = (infNFe) => {
  if (!infNFe?.det) return [];

  const dets = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];

  return dets.map((d) => ({
    nItem: d.nItem,
    ...d.prod,
  }));
};

module.exports = extractProducts;
