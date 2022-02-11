"use strict";

const webpackCommonConfigCreator = require("./webpack.config");
var path = require("path");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  entry: {
    "survey.pdf.fonts": path.resolve(__dirname, "./src/fonts.ts"),
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
  options.platform = "pdf";
  options.libraryName = "SurveyPdfFonts";

  const mainConfig = webpackCommonConfigCreator(options);
  delete mainConfig.entry["survey.pdf"];
  mainConfig.plugins.shift();
 
  return merge(mainConfig, config);
};
