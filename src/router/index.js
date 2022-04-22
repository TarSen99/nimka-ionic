import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue';
// import Login from '@/views/Login.vue';
// import SignUp from '@/views/SignUp.vue';
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
import NewProduct from '@/views/NewProduct.vue';
import NewProductSuccess from '@/views/NewProductSuccess.vue';
import MyProducts from '@/views/MyProducts.vue';
import LoginEmail from '@/views/LoginEmail.vue';
import AllowLocation from '@/views/AllowLocation.vue';
import AllowPush from '@/views/AllowPush.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import { store } from '@/store';
import { FIRST_TIME_OPEN } from '@/config/constants.js';

const routes = [
	{
		path: '/payment',
		name: 'payment',
		component: PaymentPage,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/login/email',
		name: 'Choose_email',
		component: LoginEmail,
		meta: {
			roles: ['guest'],
		},
	},
	{
		path: '/location/allow',
		name: 'Allow_location',
		component: AllowLocation,
		meta: {
			roles: ['guest', 'employee', 'owner', 'manager'],
		},
	},
	{
		path: '/push/allow',
		name: 'Allow_push',
		component: AllowPush,
		meta: {
			roles: ['guest', 'employee', 'owner', 'manager'],
		},
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			roles: ['customer', 'employee', 'owner', 'manager'],
		},
	},
	// {
	// 	path: '/login',
	// 	name: 'Login',
	// 	component: Login,
	// 	meta: {
	// 		roles: ['guest'],
	// 	},
	// },
	// {
	// 	path: '/sign-up',
	// 	name: 'Sign Up',
	// 	component: SignUp,
	// 	meta: {
	// 		roles: ['guest'],
	// 	},
	// },
	{
		path: '/product/:id',
		name: 'Product',
		component: Product,
		meta: {
			roles: ['customer', 'employee', 'owner', 'manager'],
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
			roles: ['employee', 'owner', 'manager'],
		},
	},
	{
		path: '/new-product',
		component: NewProduct,
		meta: {
			roles: ['employee', 'owner', 'manager'],
		},
	},
	{
		path: '/new-product/:id',
		component: NewProduct,
		meta: {
			roles: ['employee', 'owner', 'manager'],
		},
	},
	{
		path: '/new-product-success',
		component: NewProductSuccess,
		meta: {
			roles: ['employee', 'owner', 'manager'],
		},
	},
	{
		path: '/my-products',
		component: MyProducts,
		meta: {
			roles: ['employee', 'owner', 'manager'],
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
		redirect: () => {
			const notFirstTime = localStorage.getItem(FIRST_TIME_OPEN);

			if (notFirstTime) {
				return '/home';
			}

			return '/welcome';
		},
		exact: true,
		meta: {
			roles: ['customer', 'employee', 'owner', 'manager'],
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

const getUserRoles = () => {
	const user = store.state.user;

	return user.role;
};

router.beforeEach((to) => {
	const requiredRoles = to.meta.roles || [];
	const userRole = getUserRoles();

	if (!requiredRoles.length) {
		return true;
	}

	let isAllowed = false;

	if (requiredRoles.includes(userRole)) {
		isAllowed = true;
	}

	if (isAllowed) {
		return true;
	}

	// // if user is guest and route is for guests
	// if (requiredRoles.includes('guest') && !userRole) {
	// 	return true;
	// }

	// if (
	// 	requiredRoles.includes('guest') &&
	// 	requiredRoles.length === 1 &&
	// 	userRole
	// ) {
	// 	return '/home';
	// }

	// //not allowed here
	// if (to.path !== '/welcome') {
	// 	return '/welcome';
	// }

	return true;
});

export default router;
