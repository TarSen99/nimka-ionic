import http from '@/services/http/index.js';

export default {
	namespaced: true,
	state: () => ({
		orders: [],
		status: ['to_take', 'payed'],
	}),
	mutations: {
		saveOrder(state, order) {
			const index = state.orders.findIndex((o) => o.id === order.id);

			if (index > -1) {
				state.orders.splice(index, 1, { ...order });
				return;
			}

			state.orders.unshift({ ...order });
		},
		setStatus(state, status) {
			state.status = status;
		},
		clear(state) {
			state.orders = [];
		},
		updatePlaceOrders(state, orders) {
			state.orders = orders;
		},
		updateOrderStatus(state, { order, status }) {
			const currOrder = state.orders.find((o) => o.id === order.id);

			currOrder.status = status;
		},
	},
	actions: {
		getOrderDetails({ commit }, { orderId }) {
			return http.get(`/orders/${orderId}`).then((res) => {
				const data = {
					...res.data.data,
				};

				commit('saveOrder', data);

				return data;
			});
		},
		getPlaceOrders({ commit, state }, { placeId, statuses = [] }) {
			let newStatus = state.status;

			for (const s of statuses) {
				if (!newStatus.includes(s)) {
					newStatus.push(s);
				}
			}

			commit('setStatus', newStatus);

			return http
				.get(`/places/${placeId}/orders?status=${state.status.join(',')}`)
				.then((res) => {
					commit('updatePlaceOrders', res.data.data);

					return res;
				});
		},
	},
	getters: {},
};
