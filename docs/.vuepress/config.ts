import { description } from '../../package.json';
import { defaultTheme } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import path from 'path';
import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import docsearchPlugin from '@vuepress/plugin-docsearch';
import { version } from '../../package.json';

export default defineUserConfig({
    title: 'Unidata',
    description: description,

    head: [
        ['meta', { name: 'theme-color', content: '#fff' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'icon', href: '/images/logo.png' }],
        [
            'script',
            { type: 'module', src: 'https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js' },
        ],
    ],

    plugins: [
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components'),
        }),
        docsearchPlugin({
            apiKey: '3f968df846740a9e2b38e89d8e6ce9fa',
            indexName: 'unidata',
            appId: 'LNA1UZCPZB',
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
                    link: '/guide/README.md',
                    children: ['/guide/README.md'],
                },
                {
                    text: 'Assets',
                    link: '/guide/assets/README.md',
                    children: [
                        '/guide/assets/README.md',
                        {
                            text: 'Ethereum NFT',
                            collapsible: true,
                            link: '/guide/assets/Ethereum-NFT/README.md',
                            children: [
                                '/guide/assets/Ethereum-NFT/README.md',
                                '/guide/assets/Ethereum-NFT/NFTScan.md',
                                '/guide/assets/Ethereum-NFT/Alchemy.md',
                                '/guide/assets/Ethereum-NFT/Moralis.md',
                                '/guide/assets/Ethereum-NFT/OpenSea.md',
                                '/guide/assets/Ethereum-NFT/POAP.md',
                                '/guide/assets/Ethereum-NFT/Crossbell.md',
                            ],
                        },
                        {
                            text: 'Solana NFT',
                            link: '/guide/assets/Solana-NFT/README.md',
                            collapsible: true,
                            children: [
                                '/guide/assets/Solana-NFT/README.md',
                                '/guide/assets/Solana-NFT/Solscan.md',
                                '/guide/assets/Solana-NFT/Moralis.md',
                            ],
                        },
                        {
                            text: 'Flow NFT',
                            link: '/guide/assets/Flow-NFT/README.md',
                            collapsible: true,
                            children: ['/guide/assets/Flow-NFT/README.md', '/guide/assets/Flow-NFT/Alchemy.md'],
                        },
                        '/guide/assets/Gitcoin-Contribution.md',
                    ],
                },
                {
                    text: 'Notes',
                    link: '/guide/notes/README.md',
                    children: [
                        '/guide/notes/README.md',
                        '/guide/notes/Ethereum-NFT-Activity.md',
                        '/guide/notes/Gitcoin-Contribution.md',
                        '/guide/notes/Crossbell-Note.md',
                        '/guide/notes/Mirror-Entry.md',
                    ],
                },
                {
                    text: 'Profiles',
                    link: '/guide/profiles/README.md',
                    children: [
                        '/guide/profiles/README.md',
                        '/guide/profiles/Crossbell-Profile.md',
                        '/guide/profiles/ENS.md',
                    ],
                },
                {
                    text: 'Links',
                    link: '/guide/links/README.md',
                    children: ['/guide/links/README.md', '/guide/links/Crossbell-Link.md'],
                },
            ],
        },
    }),

    clientConfigFile: path.resolve(__dirname, './init.ts'),

    bundler: viteBundler({
        viteOptions: {
            define: {
                SDK_VERSION: JSON.stringify(version),
                'global.crypto': {},
                'global.msCrypto': {},
                'process.env': {},
            },
            build: {
                target: 'esnext',
            },
            ssr: {
                noExternal: ['lodash-es'],
            },
        },
    }),
});
