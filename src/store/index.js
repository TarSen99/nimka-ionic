import { createStore } from 'vuex';
import menuModule from './modules/menu.js';
import userModule from './modules/user.js';
import company from './modules/company.js';
import register from './modules/register.js';
import products from './modules/products.js';
import myOrders from './modules/myOrders.js';
import placeOrders from './modules/placeOrders.js';
import lastProducts from './modules/lastProducts.js';

export const store = createStore({
	modules: {
		menu: menuModule,
		user: userModule,
		company,
		register,
		products,
		myOrders,
		placeOrders,
		lastProducts,
	},
});
