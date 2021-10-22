import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import Product from '@/views/Product.vue';

const routes = [
	{
		path: '/home',
		name: 'Home',
		component: Home,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/sign-up',
		name: 'Sign Up',
		component: SignUp,
	},
	{
		path: '/product/:id',
		name: 'Product',
		component: Product,
	},
	{
		path: '/',
		redirect: '/home',
		exact: true
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
