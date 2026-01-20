import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import bannerPlugin from 'rollup-plugin-license';
import terser from '@rollup/plugin-terser';
import { resolve } from 'node:path';
import packageJSON from './package.json' assert { type: 'json' };
const VERSION = packageJSON.version;
const banner = [
    'surveyjs - SurveyJS PDF library v' + VERSION,
    'Copyright (c) 2015-' + new Date().getFullYear() + ' Devsoft Baltic OÜ  - http://surveyjs.io/',
    'License: MIT (http://www.opensource.org/licenses/mit-license.php)'
].join('\n');

export function createUmdConfigs (options) {
    const { input, globalName, external, globals, dir, tsconfig, declarationDir, emitMinified } = options;
    const commonOutput = {
        dir,
        format: 'umd',
        exports: 'named',
        name: globalName,
        globals: globals
    };
    const commonOptions = {
        input,
        context: 'this',
        external,
    };
    const commonPlugins = [
        nodeResolve(),
        commonjs(),
        replace({
            preventAssignment: false,
            values: {
                'process.env.RELEASE_DATE': JSON.stringify(new Date().toISOString().slice(0, 10)),
                'process.env.VERSION': JSON.stringify(VERSION),
            }
        }),
    ];
    if (Object.keys(input).length > 1) throw Error('umd config accepts only one input');
    const configs = [{
        ...commonOptions,
        plugins: [
            typescript({
                tsconfig: tsconfig, compilerOptions: declarationDir ? {
                    inlineSources: true,
                    sourceMap: true,
                    declaration: true,
                    declarationDir: declarationDir
                } : {}
            }),
            ...commonPlugins,
            bannerPlugin({
                banner: {
                    content: banner,
                    commentStyle: 'ignored',
                }
            }),
        ],
        output: [
            { ...commonOutput, entryFileNames: '[name].js', sourcemap: true },
        ],
    }];
    if (emitMinified) {
        configs.push({
            ...commonOptions,
            plugins: [
                typescript({
                    tsconfig: tsconfig,
                    sourceMap: false,
                    inlineSources: false,
                }),
                ...commonPlugins,
                terser({ format: { comments: false } }),
                bannerPlugin({
                    banner: {
                        content: `For license information please see ${Object.keys(input)[0]}.min.js.LICENSE.txt`,
                        commentStyle: 'ignored',
                    },
                    thirdParty: {
                        output: {
                            file: resolve(dir, `${Object.keys(input)[0]}.min.js.LICENSE.txt`),
                            template: () => {
                                return `/*!\n${banner.split('\n').map(str => ' * ' + str).join('\n')}\n */`;
                            }
                        }
                    }
                })
            ],
            output: [
                { ...commonOutput, entryFileNames: '[name].min.js', sourcemap: false },
            ],
        });
    }
    return configs;
}
export function createEsmConfigs (options) {
    const { input, external, dir, tsconfig, sharedFileName } = options;
    return [{
        context: 'this',
        input,
        plugins: [
            nodeResolve(),
            commonjs(),
            replace({
                preventAssignment: false,
                values: {
                    'process.env.RELEASE_DATE': JSON.stringify(new Date().toISOString().slice(0, 10)),
                    'process.env.VERSION': JSON.stringify(VERSION),
                }
            }),

            typescript({
                tsconfig: tsconfig, compilerOptions: {
                    'target': 'ES6'
                }
            }),
            bannerPlugin({
                banner: {
                    content: banner,
                    commentStyle: 'ignored',
                }
            })
        ],
        external,
        output: [
            {
                dir,
                entryFileNames: '[name].mjs',
                format: 'esm',
                exports: 'named',
                sourcemap: true,
                chunkFileNames: (chunkInfo) => {
                    if (!chunkInfo.isEntry) {
                        return sharedFileName;
                    }
                },
            }
        ],
    }];
}