import http from '@/services/http';
import {
	CURRENT_COMPANY_KEY,
	COMPANY_PLACES,
	COMPANY_DETAILS,
} from '@/config/constants.js';

const toast = {
	state: () => ({
		id: +localStorage.getItem(CURRENT_COMPANY_KEY),
		details: JSON.parse(localStorage.getItem(COMPANY_DETAILS) || '{}'),
		places: JSON.parse(localStorage.getItem(COMPANY_PLACES) || '[]'),
	}),
	mutations: {
		clear(state) {
			state.id = null;
			state.details = {};
			state.places = [];
		},
		updateCompany(state, company) {
			state.id = company.id;
			state.details = company;
			state.places = company.Places;
		},
	},
	actions: {
		fetchDetails({ commit, state }, id) {
			const currId = id || state.id;

			return http.get(`/companies/${currId}`).then((res) => {
				localStorage.setItem(CURRENT_COMPANY_KEY, res.data.data.id);

				localStorage.setItem(
					COMPANY_PLACES,
					JSON.stringify(res.data.data.Places)
				);
				localStorage.setItem(COMPANY_DETAILS, JSON.stringify(res.data.data));

				commit('updateCompany', res.data.data);
			});
		},
	},
	getters: {},
	namespaced: true,
};

export default toast;
