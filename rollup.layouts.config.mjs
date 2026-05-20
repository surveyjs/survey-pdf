import { createEsmConfig, createUmdConfig } from './rollup.helpers.mjs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import packageJSON from './package.json' with { type: 'json' };
const version = packageJSON.version;
const buildPath = fileURLToPath(new URL('./build', import.meta.url));
const inputs = {
  'spacious': fileURLToPath(new URL('./src/appearance/layouts/spacious.ts', import.meta.url)),
  'compact': fileURLToPath(new URL('./src/appearance/layouts/compact.ts', import.meta.url)),
  'index': fileURLToPath(new URL('./src/appearance/layouts/index.ts', import.meta.url)),
}
const tsconfig = fileURLToPath(new URL('./tsconfig.layouts.json', import.meta.url));
export default [
  createEsmConfig({
    input: { 'index': inputs['index'] },
    dir: resolve(buildPath, './fesm/layouts'),
    tsconfig: tsconfig,
    version
  }),
  ...Object.entries(inputs).map(([name, path]) => 
    createUmdConfig({
      input: { [name]: path },
      dir: resolve(buildPath, './layouts'),
      tsconfig: tsconfig,
      exports: name == "index" ? "named" : "default",
      globalName:  name == "index" ? "DocLayout" : "DocLayout." + name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
      version,
      declarationDir: resolve(buildPath, './layouts'),
    })
  )
];