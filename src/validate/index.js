import { defineRule } from 'vee-validate';
const expiration = require('creditcards/expiration');

function isRequired(value) {
	if (value && value.trim()) {
		return true;
	}
	return 'Field is required';
}

function isValidExpirationCardDate(value) {
	const [month, year] = value.split('/');
	const fullYear = +`20${year}`;
	const monthNumber = +month;

	if (monthNumber > 12) {
		return 'Expiration date is not valid';
	}

	if (!fullYear) {
		return 'Expiration date is not valid';
	}

	if (!monthNumber) {
		return 'Expiration date is not valid';
	}

	if (expiration.isPast(monthNumber, fullYear)) {
		return 'Expiration date is not valid';
	}

	return true;
}

function maxWidth(value, [limit]) {
	const v = value || '';

	if (v.length > limit) {
		return `Max width is ${limit} symbols`;
	}

	return true;
}

function minWidth(value, [limit]) {
	const v = value || '';

	if (v.length < limit) {
		return `Min width is ${limit} symbols`;
	}

	return true;
}

function fixedWidth(value, [limit]) {
	const v = value || '';
	const withoutSpace = v.replace(/\s/g, '');

	if (withoutSpace.length !== +limit) {
		return `Width should be ${limit} symbols`;
	}

	return true;
}

defineRule('required', isRequired);
defineRule('card-exp', isValidExpirationCardDate);
defineRule('max-width', maxWidth);
defineRule('min-width', minWidth);
defineRule('width', fixedWidth);
