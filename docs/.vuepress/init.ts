import Unidata from '../../src/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';

library.add(faPenToSquare, faLink, faGithub, faTwitter, faTelegram, faDiscord, faReddit);

export default ({ app }) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.use(ElementPlus);

    app.config.globalProperties.Unidata = Unidata;
    app.config.globalProperties.unidata = new Unidata({
        moralisWeb3APIKey: 'gqcVQSCpWGNlfs2nMM1xvW1pOmZhzHc058aNpEK8BKIp26Q39PJemBu5BJi6SZOD',
    });
};
