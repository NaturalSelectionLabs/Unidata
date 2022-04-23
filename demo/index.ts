import Vue, { createApp } from 'vue';
import App from './App.vue';
import Unidata from '../src/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';

library.add(faPenToSquare, faLink, faGithub, faTwitter, faTelegram, faDiscord, faReddit);

const app = createApp(App);

app.config.globalProperties.identity = localStorage.getItem('address') || '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';
app.config.globalProperties.unidata = new Unidata({
    infuraProjectID: 'e3430df561d64784abc08a6feb2f4e50',
});
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus);

app.mount('#app');
