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

    (<any>window).Unidata = Unidata;
    (<any>window).unidata = new Unidata({
        infuraProjectID: 'e3430df561d64784abc08a6feb2f4e50',
    });
};
