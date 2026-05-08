import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
    return {
        test: {
            environment: 'jsdom',
            globals: false,
            setupFiles: ['./vitest-setup.ts'],
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