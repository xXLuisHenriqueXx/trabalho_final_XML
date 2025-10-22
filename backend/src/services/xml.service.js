const xml2js = require("xml2js");

const parseXML = async (buffer) => {
  const xml = buffer.toString("utf8");

  const json = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
    ignoreAttrs: false,
  });
  return { xml, json };
};

module.exports = { parseXML };
