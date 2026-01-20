import { createEsmConfigs, createUmdConfigs } from './rollup.helpers.mjs';
import { env } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
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
    ...createEsmConfigs(
        {
            input,
            dir,
            external,
            tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
        }
    ),
    ...createUmdConfigs(
        {
            input,
            dir,
            external,
            globalName,
            tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
            emitMinified: env.emitMinified === 'true',
            globals: umdGlobals
        }
    )
];