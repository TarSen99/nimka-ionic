import http from '@/services/http';
import {
	CURRENT_COMPANY_KEY,
	CURRENT_USER_ROLE,
	ROLES,
} from '@/config/constants.js';

const toast = {
	state: () => ({
		id: +localStorage.getItem(CURRENT_COMPANY_KEY),
		role: localStorage.getItem(CURRENT_USER_ROLE) || ROLES.GUEST,
		details: {},
	}),
	mutations: {
		update(state, details) {
			state.details = details;
		},
		updateId(state, id) {
			state.id = id;
		},
		updateRole(state, role) {
			state.role = role;
		},
	},
	actions: {
		fetchDetails({ commit, state }, id) {
			const currId = id || state.id;

			http.get(`/companies/${currId}`).then((res) => {
				commit('update', res.data.data);
			});
		},
		updateId({ commit }, id) {
			localStorage.setItem(CURRENT_COMPANY_KEY, id);

			commit('updateId', id);
		},
		updateRole({ commit }, role) {
			localStorage.setItem(CURRENT_USER_ROLE, role);

			commit('updateRole', role || ROLES.GUEST);
		},
	},
	getters: {},
	namespaced: true,
};

export default toast;
