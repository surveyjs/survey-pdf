import { createEsmConfigs, createUmdConfigs } from './rollup.helpers.mjs';
import { resolve } from 'node:path';
import { env } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
const buildPath = fileURLToPath(new URL('./build', import.meta.url));
const external = {
    'fs': 'fs'
};
export default [
    ...createEsmConfigs({
        sharedFileName: 'pdf-form-filler-shared.mjs',
        tsconfig: fileURLToPath(new URL('./tsconfig.forms.json', import.meta.url)),
        external,
        dir: resolve(buildPath, './fesm'),
        input: {
            'pdf-form-filler': fileURLToPath(new URL('./src/entries/forms.ts', import.meta.url)),
            'pdf-form-filler.node': fileURLToPath(new URL('./src/entries/forms-node.ts', import.meta.url))
        },
    }),
    ...createUmdConfigs({
        tsconfig: fileURLToPath(new URL('./tsconfig.forms.json', import.meta.url)),
        external,
        declarationDir: resolve(buildPath, './forms-typings'),
        dir: resolve(buildPath),
        emitMinified: env.emitMinified === 'true',
        globalName: 'PDFFormFiller',
        globals: {
            'fs': 'fs'
        },
        input: {
            'pdf-form-filler': fileURLToPath(new URL('./src/entries/forms.ts', import.meta.url)),
        },
    }),
    ...createUmdConfigs({
        tsconfig: fileURLToPath(new URL('./tsconfig.forms.json', import.meta.url)),
        external,
        dir: buildPath,
        emitMinified: env.emitMinified === 'true',
        globalName: 'PDFFormFiller',
        globals: {
            'fs': 'fs'
        },
        input: {
            'pdf-form-filler.node': fileURLToPath(new URL('./src/entries/forms-node.ts', import.meta.url)),
        },
    })
];