"use strict";

const webpackCommonConfigCreator = require("./webpack.config");
var path = require("path");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  entry: {
    "survey.pdf.forms": path.resolve(__dirname, "./src/entries/forms.ts"),
  }
};

module.exports = function (options) {
  options.libraryName = "PDFFormFiller";

  const mainConfig = webpackCommonConfigCreator(options);
  mainConfig.entry = {};
  mainConfig.plugins.shift();
  return merge(mainConfig, config);
};
