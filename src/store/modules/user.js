import {
	CURRENT_USER_KEY,
	CURRENT_USER_ROLE,
	USER_DETAILS,
	CURRENT_GEOLOCATION,
	GEO_IS_HARDCODED,
	CURRENT_TOKEN,
	ROLES,
	CURRENT_RADIUS,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
const { setItem } = useNativeStore();
import http from '@/services/http';

export default {
	namespaced: true,
	state: () => ({
		isAuthorizated: !!localStorage.getItem(CURRENT_USER_KEY),
		role: localStorage.getItem(CURRENT_USER_ROLE),
		details: {},
		profileSettings: {},
		appRendered: false,
		pushListenersAdded: false,
		notificationsAsked: false,
		listLocationSettings: null,
	}),
	mutations: {
		changeListLocationSettings(state, value) {
			state.listLocationSettings = value;
		},
		changeNotificationsAsked(state, value) {
			state.notificationsAsked = value;
		},
		changePushListenersAdded(state, value) {
			state.pushListenersAdded = value;
		},
		changeAppRendered(state, value) {
			state.appRendered = value;
		},
		handleAuth(state, value) {
			state.isAuthorizated = value;
		},
		handleRole(state, value) {
			state.role = value;
		},
		updateDetails(state, value) {
			state.details = value;
		},
		updateSettings(state, value) {
			state.profileSettings = value;
		},
	},
	actions: {
		async updateUserSettings({ commit, state }) {
			setItem(CURRENT_RADIUS, state.profileSettings.searchRadius);

			const data = {
				searchRadius: state.profileSettings.searchRadius,
				sendNewProductNotifications:
					state.profileSettings.sendNewProductNotifications,
			};
			return http.put('/users/settings/update', data).then((res) => {
				commit('updateSettings', res.data.data);
			});
		},
		async updateLocation({ commit, state }, data) {
			if (!data.latitude || !data.longtitude) {
				return;
			}

			await setItem(
				CURRENT_GEOLOCATION,
				JSON.stringify({
					latitude: data.latitude,
					longtitude: data.longtitude,
				})
			);

			commit('updateDetails', {
				...state.details,
				latitude: data.latitude,
				longtitude: data.longtitude,
			});
		},
		updateRole({ commit }, role) {
			localStorage.setItem(CURRENT_USER_ROLE, role);

			commit('handleRole', role);
		},
		async updateDetails({ commit, dispatch }, data) {
			commit('updateDetails', data);
			commit('updateSettings', data?.ProfileSetting);

			if (!data) {
				return;
			}

			if (data.token) {
				localStorage.setItem(CURRENT_TOKEN, data.token);
			}

			commit('handleAuth', true);
			setItem(USER_DETAILS, JSON.stringify(data));
			localStorage.setItem(CURRENT_USER_KEY, data.id);

			const company = (data.Companies && data.Companies[0]) || {};
			const role = company.UsersAndCompanies?.role;
			dispatch('updateRole', role || ROLES.CUSTOMER);

			// There is no role for customer in db
			if (role) {
				return;
			}

			setItem(CURRENT_RADIUS, data?.ProfileSetting?.searchRadius);

			// Save location only if it's hardcoded
			// otherwise use autodetection
			if (data.latitude && data.longtitude && data.address) {
				await setItem(
					CURRENT_GEOLOCATION,
					JSON.stringify({
						latitude: data.latitude,
						longtitude: data.longtitude,
					})
				);
			}

			if (data.address && data.latitude && data.longtitude) {
				await setItem(GEO_IS_HARDCODED, true);
			}
		},
	},
};
