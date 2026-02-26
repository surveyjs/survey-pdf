import { createEsmConfig, createUmdConfig } from './rollup.helpers.mjs';
import { env } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import packageJSON from './package.json' assert { type: "json" };
const version = packageJSON.version;
const dir = fileURLToPath(new URL('./build', import.meta.url));
const external = [
    'survey-pdf',
];
const globalName = 'SurveyPdfFonts';
const umdGlobals = {
    'survey-pdf': 'SurveyPDF'
};
const input = { 'survey.pdf.fonts': fileURLToPath(new URL('./src/fonts.ts', import.meta.url)) };
export default [
    createEsmConfig(
        {
            input,
            dir: resolve(dir, './fesm'),
            external,
            tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
            version
        }
    ),
    createUmdConfig(
        {
            input,
            dir,
            external,
            globalName,
            tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
            emitMinified: env.emitMinified === 'true',
            globals: umdGlobals,
            version
        }
    )
];