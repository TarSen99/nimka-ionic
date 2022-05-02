import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue';
import HomeEmployee from '../views/HomeEmployee.vue';
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
import SelectPlace from '@/views/SelectPlace.vue';
import { store } from '@/store';
import { FIRST_TIME_OPEN } from '@/config/constants.js';
import { ROLES } from '../config/constants';

const routes = [
	{
		path: '/places/select',
		name: 'SelectPlace',
		component: SelectPlace,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: HomeEmployee,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/payment',
		name: 'payment',
		component: PaymentPage,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/login/email',
		name: 'Choose_email',
		component: LoginEmail,
	},
	{
		path: '/location/allow',
		name: 'Allow_location',
		component: AllowLocation,
	},
	{
		path: '/push/allow',
		name: 'Allow_push',
		component: AllowPush,
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			roles: [ROLES.CUSTOMER],
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
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER, ROLES.CUSTOMER],
		},
	},
	{
		path: '/checkout',
		component: Checkout,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/success',
		component: CheckoutSuccess,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/account',
		component: Account,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/address',
		component: Address,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/orders',
		component: Orders,
		meta: {
			roles: [ROLES.CUSTOMER],
		},
	},
	{
		path: '/incoming-orders',
		component: IncomingOrders,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/new-product',
		component: NewProduct,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/new-product/:id',
		component: NewProduct,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/product-success/:id',
		component: NewProductSuccess,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
		},
	},
	{
		path: '/my-products',
		component: MyProducts,
		meta: {
			roles: [ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
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
			roles: [ROLES.CUSTOMER, ROLES.EMPLOYEE, ROLES.OWNER, ROLES.MANAGER],
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

const getPlace = () => {
	const user = store.state.user;

	return user.activePlace;
};

const getHomePath = (role) => {
	if (role === ROLES.CUSTOMER) {
		return '/home';
	}

	return '/dashboard';
};

const isNull = (v) => {
	if (!v) {
		return true;
	}

	return v === 'null' || v === 'undefined' || v === 'NaN';
};

router.beforeEach((to) => {
	const requiredRoles = to.meta.roles || [];
	const userRole = getUserRoles();

	const place = getPlace();

	if (
		isNull(place) &&
		to.path !== '/places/select' &&
		(userRole === ROLES.OWNER ||
			userRole === ROLES.MANAGER ||
			userRole === ROLES.EMPLOYEE)
	) {
		return '/places/select';
	}

	if (!requiredRoles.length) {
		return true;
	}

	if (requiredRoles.includes(userRole)) {
		return true;
	}

	if (
		requiredRoles.includes('guest') &&
		requiredRoles.length === 1 &&
		userRole
	) {
		return getHomePath(userRole);
	}

	// if user is guest and route is for guests
	if (requiredRoles.includes('guest') && !userRole) {
		return true;
	}

	if (!requiredRoles.includes(userRole) && userRole) {
		return getHomePath(userRole);
	}

	// //not allowed here
	// if (to.path !== '/welcome') {
	// 	return '/welcome';
	// }

	return true;
});

export default router;
