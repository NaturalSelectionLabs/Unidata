import Unidata from '../../src/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';
import { defineClientConfig } from '@vuepress/client';

library.add(faPenToSquare, faLink, faGithub, faTwitter, faTelegram, faDiscord, faReddit);

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.component('font-awesome-icon', FontAwesomeIcon);
        app.use(ElementPlus);

        // @ts-ignore
        if (!__VUEPRESS_SSR__) {
            app.config.globalProperties.Unidata = Unidata;
            app.config.globalProperties.unidata = new Unidata({
                moralisWeb3APIKey: 'gqcVQSCpWGNlfs2nMM1xvW1pOmZhzHc058aNpEK8BKIp26Q39PJemBu5BJi6SZOD',
                alchemyEthereumAPIKey: '4h0_z1B6WEmj9hp1HJZm7ujeWZpLR6rv',
                alchemyPolygonAPIKey: 'm1tznK8U8nVecA0Zime5dzF8Pb2av70q',
                alchemyFlowAPIKey: 'op8m1oqlivm297iodsezvn3hoya9960u',
            });

            (<any>window).unidata = app.config.globalProperties.unidata;
        }
    },
});
