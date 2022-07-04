import { defineConfig } from 'vite';
import path from 'path';
import { version } from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Unidata',
            fileName: (format) => `unidata.${format}.js`,
        },
        sourcemap: true,
        target: 'esnext',
    },
    define: {
        SDK_VERSION: JSON.stringify(version),
        'global.crypto': {},
        'global.msCrypto': {},
        'global.fetch': {},
        'process.env': {},
    },
    server: {
        base: '/demo/',
    },
});
