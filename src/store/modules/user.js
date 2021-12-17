export default {
	namespaced: true,
	state: () => ({
		isAuthorizated: false,
		roles: ['guest'],
	}),
	mutations: {
		handleAuth(state, value) {
			state.isAuthorizated = value;
		},
		handleRoles(state, value) {
			state.roles = value;
		},
	},
	actions: {},
};
