import http from '@/services/http/index.js';
import { USER_DETAILS } from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';

export default function () {
	const { getItem } = useNativeStore();

	const updateAddress = async ({ latitude, longtitude }) => {
		const userDetails = await getItem(USER_DETAILS);
		const userData = JSON.parse(userDetails || '{}');

		if (!Object.keys(userData).length) {
			return Promise.resolve();
		}

		return http.put('/users/update', {
			...userData,
			latitude,
			longtitude,
		});
	};

	return {
		updateAddress,
	};
}
