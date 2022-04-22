import { App } from '@capacitor/app';
import useGeolocation from '@/composables/common/geoLocation.js';

export default function () {
	const { getCurrentLocation, getDeniedValue } = useGeolocation();

	App.addListener('appStateChange', async ({ isActive }) => {
		if (!isActive) {
			return;
		}

		const force = await getDeniedValue();

		getCurrentLocation(force);
	});

	return {};
}
