import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
    return {
        // Vite 8.1.0 bumped Rolldown (1.0.3 -> 1.1.2), whose oxc transformer
        // aligned class-field handling with the TS spec: `useDefineForClassFields:
        // false` alone no longer drops uninitialized field declarations. Without
        // that, a bare field re-declaration in a subclass (e.g. `protected
        // question` in FlatHTML) emits a define after super(), clobbering the
        // value set by the base constructor and breaking the HTML question tests.
        // Per the oxc docs, restoring the legacy "set" semantics needs all three
        // options below. See https://github.com/oxc-project/oxc/issues/9192
        oxc: {
            tsconfigRaw: { compilerOptions: { useDefineForClassFields: false } },
            typescript: { removeClassFieldsWithoutInitializer: true },
            assumptions: { setPublicClassFields: true }
        },
        test: {
            environment: 'jsdom',
            globals: false,
            globalSetup: './vitest-global-setup.ts',
            include: ['tests/**/*.test.ts'],
            provide: {
                updateSnapshots: mode === 'update-snapshots'
            },
            coverage: {
                provider: 'v8',
                reporter: ['text'],
                include: ['src/**/*.ts'],
                exclude: ['src/fonts.ts']
            }
        },
    };
});