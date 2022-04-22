import http from '@/services/http/index.js';
import { CURRENT_USER_KEY } from '@/config/constants.js';
import { ORDER_STATUSES } from '@/config/constants.js';

export default {
	namespaced: true,
	state: () => ({
		orders: [],
	}),
	mutations: {
		updateMyOrders(state, orders) {
			state.orders = orders;
		},
		updateOrderStatus(state, { order, status }) {
			const currOrder = state.orders.find((o) => o.id === order.id);

			currOrder.status = status;
		},
	},
	actions: {
		getMyOrders({ commit }) {
			return http
				.get(
					`/orders/mine?customerId=${localStorage.getItem(CURRENT_USER_KEY)}`
				)
				.then((res) => {
					commit('updateMyOrders', res.data.data);
				});
		},
	},
	getters: {
		activeOrders(state) {
			const active = state.orders.filter((order) => {
				return (
					order.status === ORDER_STATUSES.ACTIVE ||
					order.status === ORDER_STATUSES.TO_TAKE ||
					order.status === ORDER_STATUSES.PAYED
				);
			});

			return active;
		},
	},
};
