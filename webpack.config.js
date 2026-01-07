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
  "License: SEE LICENSE IN LICENSE"
].join("\n");

const buildPlatformJson = {
  name: "survey-pdf",
  version: packageJson.version,
  homepage: "https://surveyjs.io/",
  author: "DevSoft Baltic OÜ <info@devsoftbaltic.com>",
  license: "SEE LICENSE IN LICENSE",
  licenseUrl: "https://surveyjs.io/licensing",
  description: "A UI component that uses SurveyJS form JSON schemas to render forms as PDF documents. It populates PDF fields with data collected using SurveyJS Form Library and lets you export your SurveyJS forms as editable or pre-filled PDFs.",
  keywords: [
    "survey",
    "surveyjs",
    "pdf",
    "form",
    "survey-export",
    "pdf-generator",
    "pdf-export",
    "interactive-pdf-form",
    "json-form",
    "data-collection",
    "client-side",
    "javascript",
    "typescript",
    "survey-library",
    "export-form",
    "print-form",
    "editable-pdf",
    "fillable-pdf",
    "jsPDF",
    "json-schema"
  ],
  module: "fesm/survey.pdf.mjs",
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
    "@csstools/css-color-parser": "^3.1.0",
    "@types/node-fetch": "^2",
    "jspdf": "^2.3.0 || ^3 || ^4",
    "image-size": "^2",
    "node-fetch": "^2",
  },
  exports: {
    ".": {
      "types": "./typings/entries/pdf.d.ts",
      "node": {
        "import": "./fesm/survey.pdf.node.mjs",
        "require": "./survey.pdf.node.js"  
      },
      "import": "./fesm/survey.pdf.mjs",
      "require": "./survey.pdf.js",
    },
    "./survey.pdf.fonts": {
      "import": "./fesm/survey.pdf.fonts.mjs",
      "require": "./survey.pdf.fonts.js"
    },
    "./themes": {
      "types": "./themes/index.d.ts",
      "import": "./fesm/themes/index.mjs",
      "require": "./themes/index.js"
    },
    "./themes/index": {
      "types": "./themes/index.d.ts",
      "import": "./fesm/themes/index.mjs",
      "require": "./themes/index.js"
    },
    "./themes/*": {
      "types": "./themes/*.d.ts",
      "default": "./themes/*.js",
    },
    "./pdf-form-filler": {
      "types": "./forms-typings/entries/forms.d.ts",
      "node": {
        "import": "./fesm/pdf-form-filler.node.mjs",
        "require": "./pdf-form-filler.node.js"  
      },
      "import": "./fesm/pdf-form-filler.mjs",
      "require": "./pdf-form-filler.js"
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
    entry:  {
      "survey.pdf": path.resolve(__dirname, "./src/entries/" + "pdf"),
      "survey.pdf.node": path.resolve(__dirname, "./src/entries/" + "pdf-node")
    },
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
              compilerOptions: emitDeclarations ? {} : {
                declaration: false,
                declarationDir: null
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
      umdNamedDefine: true,
      globalObject: "this",
    },
    externals: {
      jspdf: {
        root: "jspdf",
        commonjs2: "jspdf",
        commonjs: "jspdf",
        amd: "jspdf"
      },
      "node-fetch": "node-fetch",
      "image-size": "image-size",
      '@csstools/css-calc': '@csstools/css-calc',
      '@csstools/css-color-parser': '@csstools/css-color-parser',
      '@csstools/css-parser-algorithms': '@csstools/css-parser-algorithms',
      '@csstools/css-tokenizer': '@csstools/css-tokenizer',
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
  return config;
};
