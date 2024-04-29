"use strict";

var webpack = require("webpack");
var path = require("path");
var dts = require("dts-bundle");
var rimraf = require("rimraf");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var packageJson = require("./package.json");
var fs = require("fs");

const today = new Date();
const year = today.getFullYear();

var banner = [
  "surveyjs - SurveyJS PDF library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)"
].join("\n");

// TODO add to dts_bundler
var dts_banner = [
  "Type definitions for SurveyJS PDF library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>",
  ""
].join("\n");

var platformOptions = {
  pdf: {
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
    keywords: ["pdf"],
    peerDependencies: {
      "survey-core": packageJson.version
    },
    dependencies: {
      jspdf: "^2.3.0",
    }
  }
};

module.exports = function(options) {
  //TODO
  options.platformPrefix = options.platform;
  var packagePath = "./packages/survey-" + options.platform + "/";

  var percentage_handler = function handler(percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
    } else if (1 === percentage) {
      if (options.buildType === "prod") {
        dts.bundle({
          name: "../../survey." + options.platformPrefix,
          main: packagePath + "typings/entries/" + options.platform + ".d.ts",
          outputAsModuleFolder: true,
          headerText: dts_banner
        });
        rimraf.sync(packagePath + "typings");
        fs.createReadStream("./LICENSE").pipe(
          fs.createWriteStream(packagePath + "LICENSE")
        );
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(packagePath + "README.md")
        );
      }
    }
  };

  var mainFile = "survey." + options.platformPrefix + ".js";
  var packagePlatformJson = {
    name: "survey-" + options.platform,
    version: packageJson.version,
    description:
      "survey.pdf.js is a SurveyJS PDF Library. It is a easy way to export SurveyJS surveys to PDF. It uses JSON for survey metadata.",
    keywords: ["Survey", "JavaScript", "PDF", "Library"].concat(
      platformOptions[options.platform].keywords
    ),
    homepage: "https://surveyjs.io/",
    license: "SEE LICENSE IN LICENSE",
    files: [
      "survey." + options.platformPrefix + ".d.ts",
      "survey." + options.platformPrefix + ".js",
      "survey." + options.platformPrefix + ".min.js",
      "survey." + options.platformPrefix + ".fonts.js",
      "survey." + options.platformPrefix + ".fonts.min.js"    ],
    main: mainFile,
    repository: {
      type: "git",
      url: "https://github.com/surveyjs/survey-pdf.git"
    },
    typings: "survey." + options.platformPrefix + ".d.ts"
  };

  if (!!platformOptions[options.platform].dependencies) {
    packagePlatformJson.dependencies =
      platformOptions[options.platform].dependencies;
  }
  if (!!platformOptions[options.platform].peerDependencies) {
    packagePlatformJson.peerDependencies =
      platformOptions[options.platform].peerDependencies;
  }

  var config = {
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
              compilerOptions: {
                declaration: options.buildType === "prod",
                outDir: packagePath + "typings/"
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
      filename:
        packagePath +
        "[name]" +
        (options.buildType === "prod" ? ".min" : "") +
        ".js",
      library: options.libraryName || "SurveyPDF",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: platformOptions[options.platform].externals,
    plugins: [
      new webpack.ProgressPlugin(percentage_handler),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version)
      }),
      new webpack.BannerPlugin({
        banner: banner
      })
    ],
    devtool: "inline-source-map"
  };

  if (options.buildType === "prod") {
    config.devtool = false;
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
      new GenerateJsonPlugin(
        packagePath + "package.json",
        packagePlatformJson,
        undefined,
        2
      )
    ]);
  }

  if (options.buildType === "dev") {
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true })
    ]);
  }

  config.entry["survey." + options.platform] = path.resolve(
    __dirname,
    "./src/entries/" + options.platform
  );

  return config;
};
