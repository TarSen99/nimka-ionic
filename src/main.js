import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/validate/index.js';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/font.css';
import './theme/custom.scss';
import './theme/transition.scss';
import './theme/padding.scss';
import './theme/margin.scss';
import './theme/bg.scss';
import './theme/colors.scss';
import './theme/fz.scss';

import { store } from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App)
	.use(IonicVue)
	.use(router)
	.use(store)
	.use(VueAxios, axios);

app.provide('axios', app.config.globalProperties.axios); // provide 'axios'

router.isReady().then(() => {
	app.mount('#app');
});
