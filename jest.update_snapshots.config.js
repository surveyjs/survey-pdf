let defaultConfig = require("./jest.config.js");
defaultConfig.globals["updateSnapshots"] = true;
module.exports = defaultConfig;