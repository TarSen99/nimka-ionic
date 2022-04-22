import { DateTime } from 'luxon';
import {
	CURRENT_TOKEN,
	CURRENT_USER_KEY,
	CURRENT_COMPANY_KEY,
	CURRENT_USER_ROLE,
} from '@/config/constants.js';

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
