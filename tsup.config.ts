import { defineConfig } from 'tsup';
import { version } from './package.json';

export default defineConfig((options) => ({
    entry: {
        index: './src/index.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    globalName: 'Unidata',
    clean: true,
    sourcemap: true,
    minify: !options.watch,
    target: 'esnext',
    dts: true,
    define: {
        SDK_VERSION: JSON.stringify(version),
    },
}));
