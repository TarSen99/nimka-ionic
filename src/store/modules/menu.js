export default {
	namespaced: true,
	state: () => ({
		isOpen: false,
	}),
	mutations: {
		handleMenu(state, value) {
			state.isOpen = value;
		},
	},
	actions: {},
};
