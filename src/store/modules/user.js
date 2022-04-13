import { CURRENT_USER_KEY, CURRENT_USER_ROLE } from '@/config/constants.js';

export default {
	namespaced: true,
	state: () => ({
		isAuthorizated: !!localStorage.getItem(CURRENT_USER_KEY),
		role: localStorage.getItem(CURRENT_USER_ROLE),
	}),
	mutations: {
		handleAuth(state, value) {
			state.isAuthorizated = value;
		},
		handleRole(state, value) {
			state.role = value;
		},
	},
	actions: {},
};
