"use strict";

const webpackCommonConfigCreator = require("./webpack.config");
var path = require("path");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  entry: {
    "survey.pdf.forms": path.resolve(__dirname, "./src/forms.ts"),
  },
  externals: {
    "survey-pdf": {
      root: "SurveyPDF",
      commonjs2: "survey-pdf",
      commonjs: "survey-pdf",
      amd: "survey-pdf"
    }
  }
};

module.exports = function (options) {
  options.libraryName = "SurveyPdfForms";

  const mainConfig = webpackCommonConfigCreator(options);
  mainConfig.entry = {};
  mainConfig.plugins.shift();
  return merge(mainConfig, config);
};
