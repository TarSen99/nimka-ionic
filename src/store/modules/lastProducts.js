export default {
	namespaced: true,
	state: () => ({
		status: ['active'],
	}),
	mutations: {
		setStatus(state, status) {
			state.status = status;
		},
	},
	actions: {},
	getters: {},
};
