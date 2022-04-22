import { useStore } from 'vuex';
import { GEO_IS_HARDCODED, CURRENT_GEOLOCATION } from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import http from '@/services/http/index.js';
import useGeolocation from '@/composables/common/geoLocation.js';
import useDaveLocation from '@/composables/auth/saveLocation.js';

const oneKmInDegrees = 0.01;

export default function () {
	const store = useStore();
	const { getItem } = useNativeStore();
	const { getCurrentLocation, getDeniedValue } = useGeolocation();
	const { updateAddress } = useDaveLocation();

	const fetchDetails = () => {
		http.get('/users/mine').then((res) => {
			const data = res.data.data;

			store.dispatch('user/updateDetails', data);
		});
	};

	const initUserData = async () => {
		fetchDetails();
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
		const addressIsHardcoded = await getItem(GEO_IS_HARDCODED);

		if (addressIsHardcoded) {
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
