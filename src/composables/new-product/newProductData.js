import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { getErrors } from '@/helpers';
import { DateTime } from 'luxon';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const validationSchema = yup.object().shape({
	title: yup
		.string()
		.when('productType', (productType, schema) => {
			if (productType === 'regular') {
				return schema.required('Field is required');
			}

			return schema;
		})
		.nullable(true),
	description: yup.string().required('Field is required'),
	availableCount: yup
		.number()
		.typeError('Field must be a number')
		.positive('Must be more than 0')
		.required('Field is required')
		.nullable(true),
	availableCountPerPerson: yup
		.number()
		.typeError('Field must be a number')
		.positive('Must be more than 0')
		.integer('Must be more than 0')
		.required('Field is required')
		.when(['availableCount'], (availableCount, schema) => {
			return schema.test({
				test: (availableCountPerPerson) =>
					availableCount >= availableCountPerPerson,
				message:
					'Available count per person can not be greater than available count',
			});
		})
		.nullable(true),
	fullPrice: yup
		.number()
		.typeError('Field must be a number')
		.positive('Must be more than 0')
		.required('Field is required')
		.nullable(true),
	discountPercent: yup
		.number()
		.typeError('Field must be a number')
		.positive('Must be more than 0')
		.required('Field is required')
		.nullable(true),
	priceWithDiscount: yup
		.number()
		.typeError('Field must be a number')
		.positive('Must be more than 0')
		.required('Field is required')
		.nullable(true),
	startTime: yup.string().required('Field is required'),
	endTime: yup.string().required('Field is required'),
});

export const PRODUCT_COUNT_OPTIONS = () => {
	const result = [
		{
			value: 999,
			name: 'A lot',
		},
	];

	for (let i = 0; i < 50; i++) {
		result.push({
			value: i + 1,
			name: i + 1 + '',
		});
	}

	return result;
};

export const getTime = (time) => {
	const d = DateTime.fromJSDate(time);
	const hour = d.get('hour');
	const minute = d.get('minute');
	const now = new Date();

	return {
		hour,
		minute,
		day: now.getDate(),
	};
};

export const getTomorrowDate = () => {
	const now = DateTime.now().plus({ days: 1 });

	return now.toFormat('DD');
};

export const getTimeTo = () => {
	const now = DateTime.now().plus({ hours: 1 });

	return now.toJSDate();
};

export default function () {
	const route = useRoute();
	const savedProductData = ref(null);

	const { setErrors, validate } = useForm({
		validationSchema,
	});

	const tomorrowDayValue = ref(null);

	const { value: title, errorMessage: titleError } = useField('title');
	const { value: productType } = useField('productType', null, {
		initialValue: 'regular',
	});
	const { value: description, errorMessage: descriptionError } =
		useField('description');
	const { value: availableCount, errorMessage: availableCountError } =
		useField('availableCount');
	const {
		value: availableCountPerPerson,
		errorMessage: availableCountPerPersonError,
	} = useField('availableCountPerPerson');
	const { value: fullPrice, errorMessage: fullPriceError } =
		useField('fullPrice');
	const { value: discountPercent, errorMessage: discountPercentError } =
		useField('discountPercent');
	const { value: priceWithDiscount, errorMessage: priceWithDiscountError } =
		useField('priceWithDiscount');
	const { value: startTime, errorMessage: startTimeError } = useField(
		'startTime',
		null,
		{
			initialValue: new Date(),
		}
	);
	const { value: endTime, errorMessage: endTimeError } = useField(
		'endTime',
		null,
		{
			initialValue: getTimeTo(),
		}
	);

	const handleUpdateTime = () => {
		if (!startTime.value || !endTime.value) {
			return;
		}

		const takeFrom = getTime(startTime.value);
		const takeTo = getTime(endTime.value);

		const timeFromEdited = DateTime.now().set(takeFrom);
		const timeToEdited = DateTime.now().set(takeTo);

		if (timeFromEdited > timeToEdited) {
			tomorrowDayValue.value = getTomorrowDate();
		} else {
			tomorrowDayValue.value = false;
		}
	};

	const getEditData = (images) => {
		const formData = new FormData();

		formData.append('title', title.value || '');
		formData.append('description', description.value);
		formData.append('availableCount', availableCount.value);
		formData.append('availableCountPerPerson', availableCountPerPerson.value);
		formData.append('fullPrice', fullPrice.value);
		formData.append('discountPercent', discountPercent.value);
		formData.append('priceWithDiscount', priceWithDiscount.value);
		formData.append('takeTimeFrom', savedProductData.value.takeTimeFrom);
		formData.append('takeTimeTo', savedProductData.value.takeTimeTo);
		formData.append('placeId', savedProductData.value.PlaceId);
		formData.append('productType', savedProductData.value.productType);

		images
			.filter((i) => i.blob)
			.forEach((img) => {
				formData.append(`images`, img.blob);
			});

		images
			.filter((i) => !i.blob)
			.forEach((img) => {
				formData.append(
					`imagesAsUrl[]`,
					JSON.stringify({ url: img.url, id: img.id })
				);
			});

		return formData;
	};

	const getData = (images, activePlaceId) => {
		if (!route.params.id) {
			const formData = new FormData();
			const takeFrom = getTime(startTime.value);
			const takeTo = getTime(endTime.value);

			const timeFromEdited = DateTime.now().set(takeFrom);
			let timeToEdited = DateTime.now().set(takeTo);

			if (tomorrowDayValue.value) {
				timeToEdited = timeToEdited.plus({ days: 1 });
			}

			formData.append('title', title.value);
			formData.append('description', description.value);
			formData.append('availableCount', availableCount.value);
			formData.append('availableCountPerPerson', availableCountPerPerson.value);
			formData.append('fullPrice', fullPrice.value);
			formData.append('discountPercent', discountPercent.value);
			formData.append('priceWithDiscount', priceWithDiscount.value);
			formData.append('takeTimeFrom', timeFromEdited.toISO());
			formData.append('takeTimeTo', timeToEdited.toISO());
			formData.append('placeId', activePlaceId);
			formData.append('productType', productType.value);

			images
				.filter((i) => i.blob)
				.forEach((img) => {
					formData.append(`images`, img.blob);
				});

			images
				.filter((i) => !i.blob)
				.forEach((img) => {
					formData.append(`imagesAsUrl[]`, JSON.stringify({ url: img.url }));
				});

			return formData;
		}

		return getEditData(images);
	};

	return {
		setErrors,
		validate,
		getTime,
		PRODUCT_COUNT_OPTIONS: PRODUCT_COUNT_OPTIONS(),
		handleUpdateTime,
		getData,

		title,
		description,
		availableCount,
		availableCountPerPerson,
		fullPrice,
		discountPercent,
		priceWithDiscount,
		startTime,
		endTime,
		tomorrowDayValue,
		savedProductData,
		productType,

		titleError,
		descriptionError,
		availableCountError,
		availableCountPerPersonError,
		fullPriceError,
		discountPercentError,
		priceWithDiscountError,
		startTimeError,
		endTimeError,
		getErrors,
	};
}
