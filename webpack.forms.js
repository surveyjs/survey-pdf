"use strict";

const webpackCommonConfigCreator = require("./webpack.config");
var path = require("path");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  entry: {
    "pdf-form-filler": path.resolve(__dirname, "./src/entries/forms.ts"),
    "pdf-form-filler.node": path.resolve(__dirname, "./src/entries/forms-node.ts"),
  },
  externals: {
    "fs": "fs"
  }
};

module.exports = function (options) {
  options.libraryName = "PDFFormFiller";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.forms.json");
  const mainConfig = webpackCommonConfigCreator(options);
  mainConfig.entry = {};
  mainConfig.plugins.shift();
  return merge(mainConfig, config);
};
