const defaultConfig = require("./rollup.config");
const path = require("path");
const fs = require("fs");
const input = {
    "survey.pdf.fonts": path.resolve(__dirname, "./src/fonts.ts"),
};

module.exports = () => {
  const config = defaultConfig();
  config.input = input;
  config.external = ["survey-pdf"];
  return config;
};