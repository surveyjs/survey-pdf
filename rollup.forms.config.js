const defaultConfig = require("./rollup.config");
const path = require("path");
const fs = require("fs");
const input = {
    "pdf-form-filler": path.resolve(__dirname, "./src/entries/forms.ts"),
};

module.exports = () => {
  const config = defaultConfig();
  config.input = input;
  return config;
};