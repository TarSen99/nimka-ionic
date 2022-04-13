import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { ref } from 'vue';
import { CURRENT_GEOLOCATION } from '@/config/constants.js';

export default function () {
	const cachedGeolocation = ref(null);

	cachedGeolocation.value = JSON.parse(
		localStorage.getItem(CURRENT_GEOLOCATION) || '{}'
	);

	const getCurrentLocation = () => {
		return Geolocation.getCurrentPosition().then((res) => {
			cachedGeolocation.value = {
				latitude: res.coords.latitude,
				longtitude: res.coords.longitude,
			};

			localStorage.setItem(
				CURRENT_GEOLOCATION,
				JSON.stringify(cachedGeolocation.value)
			);

			return {
				latitude: res.coords.latitude,
				longtitude: res.coords.longitude,
			};
		});
	};

	return {
		getCurrentLocation,
		cachedGeolocation,
	};
}
