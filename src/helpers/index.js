import { DateTime } from 'luxon';

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
