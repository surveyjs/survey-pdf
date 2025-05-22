const defaultConfig = require("./rollup.config");
const path = require("path");
const fs = require("fs");
const input = {
    "pdf-form-filler": path.resolve(__dirname, "./src/entries/forms.ts"),
    "pdf-form-filler.node": path.resolve(__dirname, "./src/entries/forms-node.ts"),
};

module.exports = () => {
  const config = defaultConfig({
    tsconfig:  path.resolve(__dirname, "./tsconfig.forms.fesm.json")
  });
  config.output[0].chunkFileNames =  (chunkInfo) => {
    if(!chunkInfo.isEntry) {
      return "pdf-form-filler-shared.mjs"
    }
  },
  config.input = input;
  return config;
};