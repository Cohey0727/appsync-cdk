const clientType = require("./clientType");
const productType = require("./productType");

const types = [clientType, productType];

module.exports = mergeTypeDefs(types);
