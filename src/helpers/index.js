import { DateTime } from 'luxon';
import {
	CURRENT_TOKEN,
	CURRENT_USER_KEY,
	CURRENT_COMPANY_KEY,
	CURRENT_USER_ROLE,
	USER_DETAILS,
	CURRENT_GEOLOCATION,
	COMPANY_PLACES,
	COMPANY_DETAILS,
	CURRENT_PLACE,
	CURRENT_PUSH_TOKEN,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import { store } from '@/store';

const { removeItem } = useNativeStore();

export const clearUserStore = () => {
	store.commit('nearest/clear');
	store.commit('user/clear');
	store.commit('company/clear');
	store.commit('myOrders/clear');
	store.commit('products/clear');
};

export const getErrors = (err) => {
	const errors = err.response?.data?.errors || [];
	const asObject = errors.reduce((prev, curr) => {
		const currData = { [curr.field]: curr.error };
		return {
			...prev,
			...currData,
		};
	}, {});

	return asObject;
};

export const getTimeFromIsoDate = (time) => {
	return DateTime.fromISO(time).toFormat('HH:mm');
};

export const distanceToKm = (distance) => {
	if (!distance) {
		return null;
	}

	const dist = distance / 1000;
	// const additional = (dist / 100) * 20;

	return dist.toFixed(2);
};

export const checkIfProductBuyAvailable = (details, boughtCount) => {
	if (details.availableCountPerPerson <= boughtCount) {
		return true;
	}

	if (details.availableCount <= boughtCount) {
		return true;
	}

	return false;
};

export const getProductsPickupDate = (products) => {
	const cp = [...products];

	const sortByLowestTime = cp.sort((a, b) => {
		const timeA = DateTime.fromISO(a.takeTimeTo);
		const timeB = DateTime.fromISO(b.takeTimeTo);

		return timeA.diff(timeB);
	});

	const lowestEl = sortByLowestTime[0];

	return lowestEl.takeTimeTo;
};

export const getProductsPickupTime = (products) => {
	const lowest = getProductsPickupDate(products);

	return DateTime.fromISO(lowest).toFormat('HH:mm');
};

export const getProductsPickupDateFrom = (products) => {
	const cp = [...products];

	const sortByGreatestTime = cp.sort((a, b) => {
		const timeA = DateTime.fromISO(a.takeTimeFrom);
		const timeB = DateTime.fromISO(b.takeTimeFrom);

		return timeB.diff(timeA);
	});

	const greatestEl = sortByGreatestTime[0];

	return greatestEl.takeTimeFrom;
};

export const getProductsPickupTimeFrom = (products) => {
	const greatest = getProductsPickupDateFrom(products);

	return DateTime.fromISO(greatest).toFormat('HH:mm');
};

export const clearLs = () => {
	localStorage.removeItem(CURRENT_TOKEN);
	localStorage.removeItem(CURRENT_USER_KEY);
	localStorage.removeItem(CURRENT_COMPANY_KEY);
	localStorage.removeItem(CURRENT_USER_ROLE);
	localStorage.removeItem(USER_DETAILS);
	localStorage.removeItem(CURRENT_GEOLOCATION);
	localStorage.removeItem(COMPANY_PLACES);
	localStorage.removeItem(CURRENT_PLACE);
	localStorage.removeItem(COMPANY_DETAILS);
	localStorage.removeItem(CURRENT_PUSH_TOKEN);
	clearUserStore();

	removeItem(CURRENT_PUSH_TOKEN);
	removeItem(CURRENT_PLACE);
	removeItem(CURRENT_TOKEN);
	removeItem(CURRENT_USER_KEY);
	removeItem(CURRENT_COMPANY_KEY);
	removeItem(CURRENT_USER_ROLE);
	removeItem(USER_DETAILS);
	removeItem(CURRENT_GEOLOCATION);
	removeItem(COMPANY_PLACES);
	removeItem(COMPANY_DETAILS);
};

export const getApproxCoords = (coords) => {
	const coordsData = JSON.parse(coords || '{}');

	if (!Object.keys(coordsData).length) {
		return;
	}

	const latitude = coordsData.latitude + '';
	const longtitude = coordsData.longtitude + '';

	return JSON.stringify({
		latitude: latitude.slice(0, 7),
		longtitude: longtitude.slice(0, 7),
	});
};

export const getTime = (date, tomorrow) => {
	const timeH = date.get('hour');
	const timeM = date.get('minute');

	const now = DateTime.now();
	const withTime = now.set({
		hour: timeH,
		minute: timeM,
		day: tomorrow ? now.get('day') + 1 : now.get('day'),
	});

	return withTime.toJSDate();
};

export const withTime = (dateStringFrom, dateStringTo) => {
	const dateStart = DateTime.fromISO(dateStringFrom);
	const dateEnd = DateTime.fromISO(dateStringTo);

	const startDay = dateStart.get('day');
	const endDay = dateEnd.get('day');
	let isTomorrow = false;

	if (endDay > startDay) {
		isTomorrow = true;
	}

	const start = getTime(dateStart);
	const end = getTime(dateEnd, isTomorrow);

	return {
		start,
		end,
	};
};
