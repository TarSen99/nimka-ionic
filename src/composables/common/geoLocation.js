import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { computed, onMounted, ref } from 'vue';
import {
	CURRENT_GEOLOCATION,
	LOCATION_NOT_ALLOWED,
	LOCATION_PERMISSION_DENIED,
	GEO_IS_HARDCODED,
	ROLES,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import { useStore } from 'vuex';

export default function () {
	const store = useStore();
	const cachedGeolocation = ref(null);
	const { setItem, getItem } = useNativeStore();

	onMounted(async () => {
		const currentGeo = await getItem(CURRENT_GEOLOCATION);
		cachedGeolocation.value = JSON.parse(currentGeo || '{}');
	});

	const setLocationNotAllowed = async (v) => {
		if (v) {
			await setItem(LOCATION_NOT_ALLOWED, 'yes');
			return;
		}

		await setItem(LOCATION_NOT_ALLOWED, 'no');
	};

	const setLocationDenied = async (v) => {
		if (v) {
			return await setItem(LOCATION_PERMISSION_DENIED, 'yes');
		}

		return await setItem(LOCATION_PERMISSION_DENIED, 'no');
	};

	const getDeniedValue = async () => {
		const v = await getItem(LOCATION_PERMISSION_DENIED);

		if (!v) {
			return false;
		}

		const denied = v === 'yes';
		return denied;
	};

	const getNotAllowedValue = async () => {
		const v = await getItem(LOCATION_NOT_ALLOWED);

		if (!v) {
			return true;
		}

		const notAllowed = v === 'yes';
		return notAllowed;
	};

	const isAuthed = computed(() => {
		return store.state.user.isAuthorizated;
	});

	const userRole = computed(() => {
		return store.state.user.role;
	});

	const getCurrentLocation = async (force) => {
		// if logged in as emlployee. Do not check location
		if (userRole.value !== ROLES.CUSTOMER) {
			return new Promise((resolve) => resolve(false));
		}

		if (!userRole.value) {
			return new Promise((resolve) => resolve(false));
		}

		const notAllowed = await getNotAllowedValue();

		if (notAllowed && !force) {
			return new Promise((resolve) => resolve(false));
		}

		const addressIsHardcoded = await getItem(GEO_IS_HARDCODED);

		if (addressIsHardcoded && !force) {
			return new Promise((resolve) => resolve(false));
		}

		if (!isAuthed.value) {
			return new Promise((resolve) => resolve(false));
		}

		return Geolocation.getCurrentPosition()
			.then(async (res) => {
				await setLocationNotAllowed(false);
				await setLocationDenied(false);

				cachedGeolocation.value = {
					latitude: res.coords.latitude,
					longtitude: res.coords.longitude,
				};

				store.dispatch('user/updateLocation', cachedGeolocation.value);

				return {
					latitude: res.coords.latitude,
					longtitude: res.coords.longitude,
				};
			})
			.catch(async () => {
				await setLocationDenied(true);
				await setLocationNotAllowed(true);

				return false;
			});
	};

	const saveLocation = async (location) => {
		await setItem(CURRENT_GEOLOCATION, JSON.stringify(location));
	};

	const getSavedLocation = async () => {
		return await getItem(CURRENT_GEOLOCATION);
	};

	return {
		getCurrentLocation,
		cachedGeolocation,
		saveLocation,
		getSavedLocation,
		setLocationNotAllowed,
		getDeniedValue,
		getNotAllowedValue,
	};
}
