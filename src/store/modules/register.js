export default {
	namespaced: true,
	state: () => ({
		phone: null,
		token: null,
	}),
	mutations: {
		updatePhone(state, phone) {
			state.phone = phone;
		},
		updateToken(state, token) {
			state.token = token;
		},
	},
	actions: {},
};
