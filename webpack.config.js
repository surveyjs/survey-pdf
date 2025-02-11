"use strict";

var webpack = require("webpack");
var path = require("path");
var packageJson = require("./package.json");
var fs = require("fs");

const today = new Date();
const year = today.getFullYear();

var banner = [
  "surveyjs - SurveyJS PDF library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)"
].join("\n");

const buildPlatformJson = {
  name: "survey-pdf",
  version: packageJson.version,
  description:
    "survey.pdf.js is a SurveyJS PDF Library. It is a easy way to export SurveyJS surveys to PDF. It uses JSON for survey metadata.",
  keywords: ["Survey", "JavaScript", "PDF", "Library", "pdf"],
  homepage: "https://surveyjs.io/",
  license: "SEE LICENSE IN LICENSE",
  module: "fesm/survey.pdf.js",
  main: "survey.pdf.js",
  repository: {
    type: "git",
    url: "https://github.com/surveyjs/survey-pdf.git"
  },
  typings: "./typings/entries/pdf.d.ts",
  peerDependencies: {
    "survey-core": packageJson.version
  },
  dependencies: {
    jspdf: "^2.3.0"
  },
  exports: {
    ".": {
      "types": "./typings/entries/pdf.d.ts",
      "import": "./fesm/survey.pdf.js",
      "require": "./survey.pdf.js"
    },
    "./survey.pdf.fonts": {
      "import": "./fesm/survey.pdf.fonts.js",
      "require": "./survey.pdf.fonts.js"
    },
  }
}

function getPercentageHandler(emitNonSourceFiles, buildPath) {
  return function (percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
    } else if (1 === percentage) {
      if (emitNonSourceFiles) {
        fs.createReadStream("./LICENSE").pipe(
          fs.createWriteStream(buildPath + "/LICENSE")
        );
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(buildPath + "/README.md")
        );
        fs.writeFileSync(
          buildPath + "/package.json",
          JSON.stringify(buildPlatformJson, null, 2),
          "utf8"
        );
      }
    }
  };
}



module.exports = function (options) {
  const emitDeclarations = !!options.emitDeclarations;
  const emitNonSourceFiles = !!options.emitNonSourceFiles;
  var buildPath = path.resolve(__dirname, "./build");

  var config = {
    mode: options.buildType === "prod" ? "production" : "development",
    entry: {},
    resolve: {
      extensions: [".ts", ".js", ".tsx"],
      alias: {
        tslib: path.join(__dirname, "./src/entries/helpers.ts")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts)$/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: options.tsConfigFile || "tsconfig.json",
              compilerOptions: {
                declaration: emitDeclarations,
                declarationDir: emitDeclarations ? buildPath + "/typings/" : null
              }
            }
          }
        },
        {
          test: /\.svg/,
          use: { loader: "url-loader" }
        },
        {
          test: /\.html$/,
          use: { loader: "html-loader" }
        }
      ]
    },
    output: {
      path: buildPath,
      filename:
        "[name]" +
        (options.buildType === "prod" ? ".min" : "") +
        ".js",
      library: options.libraryName || "SurveyPDF",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: {
      jspdf: {
        root: "jspdf",
        commonjs2: "jspdf",
        commonjs: "jspdf",
        amd: "jspdf"
      },
      "survey-core": {
        root: "Survey",
        commonjs2: "survey-core",
        commonjs: "survey-core",
        amd: "survey-core"
      }
    },
    plugins: [
      new webpack.ProgressPlugin(getPercentageHandler(emitNonSourceFiles, buildPath)),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version)
      }),
      new webpack.BannerPlugin({
        banner: banner
      })
    ],
    devtool: "source-map"
  };

  if (options.buildType === "prod") {
    config.devtool = false;
    config.optimization = {
      minimize: options.buildType === "prod",
    };
  }

  if (options.buildType === "dev") {
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true })
    ]);
  }

  config.entry["survey." + "pdf"] = path.resolve(
    __dirname,
    "./src/entries/" + "pdf"
  );

  return config;
};
