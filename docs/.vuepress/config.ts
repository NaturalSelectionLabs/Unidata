import { description } from '../../package.json';
import { defaultTheme } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import path from 'path';

module.exports = {
    title: 'Unidata',
    description: description,

    head: [
        ['meta', { name: 'theme-color', content: '#fff' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'icon', href: '/images/logo.png' }],
    ],

    plugins: [
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components'),
        }),
    ],

    theme: defaultTheme({
        repo: 'DIYgod/Unidata',
        docsDir: 'docs',
        logo: '/images/logo.png',
        sidebarDepth: 1,

        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    children: ['/guide/README.md', '/guide/getting-started.md'],
                },
                {
                    text: 'Modules',
                    children: ['/guide/profiles.md', '/guide/links.md', '/guide/assets.md', '/guide/notes.md'],
                },
            ],
        },
    }),

    clientAppEnhanceFiles: path.resolve(__dirname, './init.ts'),
};
