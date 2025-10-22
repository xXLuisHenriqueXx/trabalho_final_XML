const { getAllXML } = require("../services/database.service");
const { extractNFInfo, buildProducts } = require("../services/stats.service");

const statsController = {
  allNotes: async (_, res) => {
    try {
      const rows = await getAllXML();
      const notes = rows
        .map((r) => {
          const inf = extractNFInfo(JSON.parse(r.json));
          if (!inf) return null;
          return {
            id: r.id,
            number: inf.ide?.nNF,
            emit: inf.emit?.xNome,
            products: buildProducts(inf.det),
          };
        })
        .filter(Boolean);
      res.json({ notes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  general: async (_, res) => {
    try {
      const rows = await getAllXML();
      let notesTotal = rows.length;
      let productsTotal = 0;
      let notesTotalValue = 0;
      let productsTotalValue = 0;

      for (const r of rows) {
        const inf = extractNFInfo(JSON.parse(r.json));
        if (!inf) continue;

        notesTotalValue += parseFloat(inf.total?.ICMSTot?.vNF || 0);
        productsTotalValue += parseFloat(inf.total?.ICMSTot?.vProd || 0);
        productsTotal += Array.isArray(inf.det) ? inf.det.length : 1;
      }

      res.json({
        notesTotal,
        productsTotal,
        notesTotalValue,
        productsTotalValue,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  taxes: async (_, res) => {
    try {
      const rows = await getAllXML();
      if (!rows.length) return res.json({ message: "Nenhuma NF cadastrada" });

      const total = { ICMS: 0, IPI: 0, PIS: 0, COFINS: 0 };
      const notes = [];

      for (const r of rows) {
        const inf = extractNFInfo(JSON.parse(r.json));
        if (!inf) continue;

        const taxes = inf.total?.ICMSTot || {};
        const icms = parseFloat(taxes.vICMS || 0);
        const ipi = parseFloat(taxes.vIPI || 0);
        const pis = parseFloat(taxes.vPIS || 0);
        const cofins = parseFloat(taxes.vCOFINS || 0);

        const totalNF = icms + ipi + pis + cofins;

        total.ICMS += icms;
        total.IPI += ipi;
        total.PIS += pis;
        total.COFINS += cofins;

        notes.push({
          id: r.id,
          number: inf.ide?.nNF,
          emit: inf.emit?.xNome,
          taxesTotal: totalNF,
          details: { ICMS: icms, IPI: ipi, PIS: pis, COFINS: cofins },
        });
      }

      notes.sort((a, b) => b.taxesTotal - a.taxesTotal);

      res.json({ total, notes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  suppliers: async (_, res) => {
    try {
      const rows = await getAllXML();
      if (!rows.length) return res.json({ message: "Nenhuma NF cadastrada" });

      const suppliersMap = {};

      for (const r of rows) {
        const inf = extractNFInfo(JSON.parse(r.json));
        if (!inf?.emit) continue;

        const emit = inf.emit;
        const cnpj = (emit.CNPJ || "SEM_CNPJ").toString();
        const name = emit.xNome || "DESCONHECIDO";
        const noteValue = parseFloat(inf.total?.ICMSTot?.vNF || 0);

        if (!suppliersMap[cnpj]) {
          suppliersMap[cnpj] = {
            cnpj,
            name,
            notes: [],
            totalValue: 0,
          };
        }

        suppliersMap[cnpj].notes.push({
          id: r.id,
          number: inf.ide?.nNF,
          value: noteValue,
        });

        suppliersMap[cnpj].totalValue += noteValue;
      }

      const list = Object.values(suppliersMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  carriers: async (_, res) => {
    try {
      const rows = await getAllXML();
      if (!rows.length) return res.json({ message: "Nenhuma NF cadastrada" });

      const carriersMap = {};

      for (const r of rows) {
        const inf = extractNFInfo(JSON.parse(r.json));
        const carrier = inf?.transp?.transporta;
        if (!carrier) continue;

        const cnpj = (carrier.CNPJ || "SEM_CNPJ").toString();
        const name = carrier.xNome || carrier.xNome?.trim() || "DESCONHECIDO";
        const noteValue = parseFloat(inf.total?.ICMSTot?.vNF || 0);

        if (!carriersMap[cnpj]) {
          carriersMap[cnpj] = {
            cnpj,
            name,
            notes: [],
            totalValue: 0,
          };
        }

        carriersMap[cnpj].notes.push({
          id: r.id,
          number: inf.ide?.nNF,
          value: noteValue,
        });

        carriersMap[cnpj].totalValue += noteValue;
      }

      const list = Object.values(carriersMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = statsController;
