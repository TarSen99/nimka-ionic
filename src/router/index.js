import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import Product from '@/views/Product.vue';
import Checkout from '@/views/Checkout.vue';
import CheckoutSuccess from '@/views/CheckoutSuccess.vue';
import Account from '@/views/Account.vue';
import Address from '@/views/Address.vue';
import Orders from '@/views/Orders.vue';
import PhoneRegisterPin from '@/views/PhoneRegisterPin.vue';
import PhoneRegister from '@/views/PhoneRegister.vue';
import Welcome from '@/views/Welcome.vue';
import IncomingOrders from '@/views/IncomingOrders.vue';
import { store } from '@/store';

const routes = [
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/sign-up',
		name: 'Sign Up',
		component: SignUp,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/product/:id',
		name: 'Product',
		component: Product,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/checkout',
		component: Checkout,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/success',
		component: CheckoutSuccess,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/account',
		component: Account,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/address',
		component: Address,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/orders',
		component: Orders,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/incoming-orders',
		component: IncomingOrders,
		meta: {
			roles: ['customer'],
		},
	},
	{
		path: '/phone-register-pin',
		name: 'Phone-register-pin',
		component: PhoneRegisterPin,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/phone-register',
		name: 'Phone-register',
		component: PhoneRegister,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/welcome',
		name: 'welcome',
		component: Welcome,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/',
		redirect: '/home',
		exact: true,
		meta: {
			roles: ['customer'],
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

const getUserRoles = () => {
	const user = store.state.user;

	return user.roles;
};

router.beforeEach((to) => {
	return true;
	const requiredRoles = to.meta.roles || [];
	const userRoles = getUserRoles();

	if (!requiredRoles.length) {
		return true;
	}

	let isAllowed = false;

	requiredRoles.forEach((role) => {
		if (userRoles.includes(role)) {
			isAllowed = true;
		}
	});

	if (isAllowed) {
		return true;
	}

	//not allowed here
	if (requiredRoles.includes('guest')) {
		return '/';
	} else {
		return '/welcome';
	}
});

export default router;
