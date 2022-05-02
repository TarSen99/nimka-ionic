import { useStore } from 'vuex';
import { CURRENT_GEOLOCATION } from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import http from '@/services/http/index.js';
import useGeolocation from '@/composables/common/geoLocation.js';
import useSaveLocation from '@/composables/auth/saveLocation.js';

const oneKmInDegrees = 0.01;

export default function () {
	const store = useStore();
	const { getItem } = useNativeStore();
	const { getCurrentLocation, getDeniedValue, hasHardcodedAddress } =
		useGeolocation();
	const { updateAddress } = useSaveLocation();

	const fetchDetails = () => {
		return http.get('/users/mine').then((res) => {
			const data = res.data.data;

			store.dispatch('user/updateDetails', data);
		});
	};

	const initUserData = async () => {
		return fetchDetails();
	};

	const calculateDifference = (oldGeo, newGeo) => {
		if (!oldGeo || !Object.keys(oldGeo).length) {
			return;
		}

		if (!newGeo || !Object.keys(newGeo).length) {
			return;
		}

		const latitudeDiff = Math.abs(
			oldGeo.latitude.toFixed(5) - newGeo.latitude.toFixed(5)
		);
		const longtitudeDiff = Math.abs(
			oldGeo.longtitude.toFixed(5) - newGeo.longtitude.toFixed(5)
		);

		if (latitudeDiff + longtitudeDiff > oneKmInDegrees) {
			updateAddress(newGeo);
		}
	};

	const getCurrentLocationIfNeeded = async () => {
		if (hasHardcodedAddress.value) {
			return;
		}

		const force = await getDeniedValue();
		const oldGeo = await getItem(CURRENT_GEOLOCATION);
		const newGeo = await getCurrentLocation(force);
		calculateDifference(JSON.parse(oldGeo || '{}'), newGeo);
	};

	return {
		initUserData,
		getCurrentLocationIfNeeded,
	};
}
