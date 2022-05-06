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
                    children: ['/guide/README.md'],
                },
                {
                    text: 'Assets',
                    children: [
                        '/guide/assets/README.md',
                        {
                            text: 'Ethereum NFT',
                            collapsible: true,
                            link: '/guide/assets/Ethereum-NFT/README.md',
                            children: [
                                '/guide/assets/Ethereum-NFT/README.md',
                                '/guide/assets/Ethereum-NFT/Alchemy.md',
                                '/guide/assets/Ethereum-NFT/Moralis.md',
                                '/guide/assets/Ethereum-NFT/OpenSea.md',
                                '/guide/assets/Ethereum-NFT/POAP.md',
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
                    ],
                },
                {
                    text: 'Profiles',
                    children: ['/guide/profiles/README.md', '/guide/profiles/ENS.md', '/guide/profiles/Crossbell.md'],
                },
                {
                    text: 'Links',
                    children: ['/guide/links/README.md', '/guide/links/CyberConnect.md'],
                },
                {
                    text: 'Notes',
                    children: ['/guide/notes/README.md', '/guide/notes/Mirror-Entry.md'],
                },
            ],
        },
    }),

    clientAppEnhanceFiles: path.resolve(__dirname, './init.ts'),
};
