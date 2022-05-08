import {
	CURRENT_USER_KEY,
	CURRENT_USER_ROLE,
	USER_DETAILS,
	CURRENT_GEOLOCATION,
	CURRENT_TOKEN,
	ROLES,
	CURRENT_RADIUS,
	CURRENT_PLACE,
	SAVED_FILTERS,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
const { setItem } = useNativeStore();
import http from '@/services/http';

const defaultFilters = () => {
	return {
		type: ['restaurant', 'store'],
		product_type: ['regular', 'niambox'],
		status: ['all'],
	};
};

export default {
	namespaced: true,
	state: () => ({
		isAuthorizated: !!localStorage.getItem(CURRENT_USER_KEY),
		role: localStorage.getItem(CURRENT_USER_ROLE),
		details: JSON.parse(localStorage.getItem(USER_DETAILS) || '{}'),
		profileSettings: {},
		shouldUpdateList: false,
		pushListenersAdded: false,
		notificationsAsked: false,
		listLocationSettings: null,
		activePlace: localStorage.getItem(CURRENT_PLACE) || '',
		filters: localStorage.getItem(SAVED_FILTERS)
			? JSON.parse(localStorage.getItem(SAVED_FILTERS))
			: defaultFilters(),
	}),
	mutations: {
		clear(state) {
			state.role = null;
			state.details = {};
			state.profileSettings = {};
			state.listLocationSettings = null;
			state.isAuthorizated = false;
			state.activePlace = null;
			state.notificationsAsked = false;
		},
		changeListLocationSettings(state, value) {
			state.listLocationSettings = value;
		},
		changeNotificationsAsked(state, value) {
			state.notificationsAsked = value;
		},
		changePushListenersAdded(state, value) {
			state.pushListenersAdded = value;
		},
		changeShouldUpdateList(state, value) {
			state.shouldUpdateList = value;
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
		updateFilters(state, value) {
			state.filters = value;
		},
		updateSettings(state, value) {
			state.profileSettings = value;
		},
		setPlace(state, place) {
			state.activePlace = place;
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
		updatePlace({ commit, state }, place) {
			if (state.activePlace && !place) {
				return;
			}

			localStorage.setItem(CURRENT_PLACE, place);

			commit('setPlace', place);
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
			localStorage.setItem(USER_DETAILS, JSON.stringify(data));
			localStorage.setItem(CURRENT_USER_KEY, data.id);

			const company = (data.Companies && data.Companies[0]) || {};
			const role = company.UsersAndCompanies?.role;
			const place = company.UsersAndCompanies?.placeId;

			dispatch('updateRole', role || ROLES.CUSTOMER);
			dispatch('updatePlace', place);

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
		},
	},
};
