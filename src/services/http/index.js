import axios from 'axios';
import 'firebase/auth';
import { CURRENT_USER_KEY, CURRENT_TOKEN } from '@/config/constants.js';

const http = axios.create({
	baseURL: 'http://192.168.1.223:3000',
	withCredentials: true,
});

http.interceptors.request.use((config) => {
	const additionalHeaders = {
		token: localStorage.getItem(CURRENT_TOKEN),
		userId: localStorage.getItem(CURRENT_USER_KEY),
	};

	Object.assign(config.headers, additionalHeaders);

	return config;
});

export default http;
