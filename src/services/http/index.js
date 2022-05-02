import axios from 'axios';
import 'firebase/auth';
import {
	CURRENT_USER_KEY,
	CURRENT_TOKEN,
	CURRENT_GEOLOCATION,
	CURRENT_RADIUS,
	DEFAULT_RADIUS,
	CURRENT_USER_ROLE,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
const { getItem } = useNativeStore();

const http = axios.create({
	// baseURL: 'http://192.168.1.223:3000',
	baseURL: process.env.VUE_APP_API,
	// withCredentials: true,
});

http.interceptors.request.use(async (config) => {
	const location = await getItem(CURRENT_GEOLOCATION);
	const radius = await getItem(CURRENT_RADIUS);

	const additionalHeaders = {
		token: localStorage.getItem(CURRENT_TOKEN),
		userId: localStorage.getItem(CURRENT_USER_KEY),
		role: localStorage.getItem(CURRENT_USER_ROLE),
		location: location,
		radius: radius || DEFAULT_RADIUS,
	};

	Object.assign(config.headers, additionalHeaders);

	return config;
});

export default http;
