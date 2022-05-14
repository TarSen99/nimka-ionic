import { createI18n } from 'vue-i18n/index';

import ua from '@/locales/ua.json';

const i18n = createI18n({
	legacy: false, // you must set `false`, to use Composition API
	locale: 'ua',
	fallbackLocale: 'en',
	messages: {
		ua,
	},
	// something vue-i18n options here ...
});

export default i18n;
