import { createEsmConfig, createUmdConfig } from './rollup.helpers.mjs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { existsSync, mkdirSync, writeFileSync, createReadStream, createWriteStream } from 'fs';
import packageJSON from './package.json' assert { type: "json" };
const version = packageJSON.version;
const buildPath = fileURLToPath(new URL('./build', import.meta.url));

function emitNonSourceFiles() {
    const buildPlatformJson = {
        name: 'survey-pdf',
        version: version,
        homepage: 'https://surveyjs.io/',
        author: 'DevSoft Baltic OÜ <info@devsoftbaltic.com>',
        license: 'SEE LICENSE IN LICENSE',
        licenseUrl: 'https://surveyjs.io/licensing',
        description: 'A UI component that uses SurveyJS form JSON schemas to render forms as PDF documents. It populates PDF fields with data collected using SurveyJS Form Library and lets you export your SurveyJS forms as editable or pre-filled PDFs.',
        keywords: [
            'survey',
            'surveyjs',
            'pdf',
            'form',
            'survey-export',
            'pdf-generator',
            'pdf-export',
            'interactive-pdf-form',
            'json-form',
            'data-collection',
            'client-side',
            'javascript',
            'typescript',
            'survey-library',
            'export-form',
            'print-form',
            'editable-pdf',
            'fillable-pdf',
            'jsPDF',
            'json-schema'
        ],
        module: 'fesm/survey.pdf.mjs',
        main: 'survey.pdf.js',
        repository: {
            type: 'git',
            url: 'https://github.com/surveyjs/survey-pdf.git'
        },
        typings: './typings/entries/pdf.d.ts',
        peerDependencies: {
            'survey-core': version
        },
        dependencies: {
            '@types/node-fetch': '^2',
            'jspdf': '^2.3.0 || ^3 || ^4',
            'image-size': '^2',
            'node-fetch': '^2',
        },
        exports: {
            '.': {
                'types': './typings/entries/pdf.d.ts',
                'node': {
                    'import': './fesm/survey.pdf.node.mjs',
                    'require': './survey.pdf.node.js'
                },
                'import': './fesm/survey.pdf.mjs',
                'require': './survey.pdf.js',
            },
            './survey.pdf.fonts': {
                'import': './fesm/survey.pdf.fonts.mjs',
                'require': './survey.pdf.fonts.js'
            },
            './pdf-form-filler': {
                'types': './forms-typings/entries/forms.d.ts',
                'node': {
                    'import': './fesm/pdf-form-filler.node.mjs',
                    'require': './pdf-form-filler.node.js'
                },
                'import': './fesm/pdf-form-filler.mjs',
                'require': './pdf-form-filler.js'
            },
        }
    };
    if (!existsSync(buildPath)) {
        mkdirSync(buildPath);
    }
    writeFileSync(
        buildPath + '/package.json',
        JSON.stringify(buildPlatformJson, null, 2),
        'utf8'
    );
    createReadStream('./LICENSE').pipe(
        createWriteStream(buildPath + '/LICENSE')
    );
    createReadStream('./README.md').pipe(
        createWriteStream(buildPath + '/README.md')
    );
}

const external = [
    'jspdf',
    'survey-core',
    'image-size',
    'node-fetch',
];
const umdGlobals =
{
    'survey-core': 'Survey',
    'jspdf': 'jspdf',
    'image-size': 'image-size',
    'node-fetch': 'node-fetch'
};
const globalName = 'SurveyPDF';

if (process.env.emitNonSourceFiles === 'true') {
    emitNonSourceFiles();
}
export default [
    createEsmConfig({
        sharedFileName: 'pdf-shared.mjs',
        tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
        external,
        dir: resolve(buildPath, './fesm'),
        input: {
            'survey.pdf': fileURLToPath(new URL('./src/entries/pdf.ts', import.meta.url)),
            'survey.pdf.node': fileURLToPath(new URL('./src/entries/pdf-node.ts', import.meta.url))
        },
        version
    }),
    createUmdConfig({
        tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
        external,
        declarationDir: resolve(buildPath, './typings'),
        dir: resolve(buildPath),
        emitMinified: process.env.emitMinified === 'true',
        globalName: globalName,
        globals: umdGlobals,
        input: {
            'survey.pdf': fileURLToPath(new URL('./src/entries/pdf.ts', import.meta.url)),
        },
        version
    }),
    createUmdConfig({
        tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
        external,
        dir: resolve(buildPath),
        emitMinified: process.env.emitMinified === 'true',
        globalName: globalName,
        globals: umdGlobals,
        input: {
            'survey.pdf.node': fileURLToPath(new URL('./src/entries/pdf-node.ts', import.meta.url)),
        },
        version
    })
];