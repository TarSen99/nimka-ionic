import { createStore } from 'vuex';
import menuModule from './modules/menu.js';
import userModule from './modules/user.js';

export const store = createStore({
	modules: {
		menu: menuModule,
		user: userModule,
	},
});
