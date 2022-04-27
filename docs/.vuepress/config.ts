const { description } = require('../../package');

module.exports = {
    title: 'Unidata',
    description: description,

    head: [
        ['meta', { name: 'theme-color', content: '#fff' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'icon', href: '/images/logo.png' }],
    ],

    themeConfig: {
        repo: 'DIYgod/Unidata',
        sidebarDepth: 3,
        docsDir: 'docs',
        logo: '/images/logo.png',
    },
};
