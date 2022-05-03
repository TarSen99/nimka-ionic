export default {
	namespaced: true,
	state: () => ({
		nearest: [],
	}),
	mutations: {
		clear(state) {
			state.nearest = [];
		},
		updateNearest(state, nearest) {
			state.nearest = nearest;
		},
	},
	actions: {},
	getters: {},
};
