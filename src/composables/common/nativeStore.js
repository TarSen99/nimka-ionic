import { Storage } from '@capacitor/storage';

export default function () {
	const getItem = async (key) => {
		const res = await Storage.get({ key });

		if (!res.value || res.value === 'undefined' || res.value === 'null') {
			return res.value;
		}

		return JSON.parse(res.value);
	};

	const setItem = async (key, value) => {
		return await Storage.set({ key, value: JSON.stringify(value) });
	};

	const removeItem = async (key) => {
		return await Storage.remove({ key });
	};

	return {
		getItem,
		setItem,
		removeItem,
	};
}
