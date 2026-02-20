import { createEsmConfig, createUmdConfig } from './rollup.helpers.mjs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import packageJSON from './package.json' assert { type: 'json' };
const version = packageJSON.version;
const buildPath = fileURLToPath(new URL('./build', import.meta.url));
const inputs = {
  'default-light': fileURLToPath(new URL('./src/themes/default-light.ts', import.meta.url)),
  'spacious-light': fileURLToPath(new URL('./src/themes/spacious-light.ts', import.meta.url)),
  'index': fileURLToPath(new URL('./src/themes/index.ts', import.meta.url)),
}
const tsconfig = fileURLToPath(new URL('./tsconfig.themes.json', import.meta.url));
export default [
  createEsmConfig({
    input: { 'index': inputs['index'] },
    dir: resolve(buildPath, './fesm/themes'),
    tsconfig: tsconfig,
    version
  }),
  ...Object.entries(inputs).map(([name, path]) => 
    createUmdConfig({
      input: { [name]: path },
      dir: resolve(buildPath, './themes'),
      tsconfig: tsconfig,
      globalName:  name == "index" ? "SurveyPDFTheme" : "SurveyPDFTheme." + name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
      version,
      declarationDir: resolve(buildPath, './themes'),
    })
  )
];