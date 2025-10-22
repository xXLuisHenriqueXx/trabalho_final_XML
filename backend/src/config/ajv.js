const Ajv = require("ajv");
const nfeSchema = require("../schemas/nfe.schema.json");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(nfeSchema);

module.exports = validate;
