const Card = require('creditcards/card');
import { useField } from 'vee-validate';
import {
	formatCreditCard,
	formatDate,
	formatCvc,
} from '@/helpers/creditCard.js';
import { computed, ref } from '@vue/reactivity';

export default function() {
	const cardFormatter = Card([]);

	const { errorMessage: errorCard, value: card } = useField(
		'card',
		'required|width:16'
	);

	const { errorMessage: errorDate, value: date } = useField(
		'date',
		'required|card-exp'
	);

	const { errorMessage: errorCvc, value: cvc } = useField(
		'cvc',
		'required|min-width:3|max-width:3'
	);

	const allCardDetailsAreValid = computed(() => {
		if (
			card.value &&
			date.value &&
			cvc.value &&
			!errorCard.value &&
			!errorDate.value &&
			!errorCvc.value
		) {
			return true;
		} else {
			return false;
		}
	});

	const handleCardInput = (v) => {
		const value = cardFormatter.parse(v);
		const formatted = formatCreditCard(value);
		card.value = formatted;
	};

	const handleDateInput = (v) => {
		const value = formatDate(v);
		date.value = value;
	};

	const handleCvcInput = (v) => {
		const value = formatCvc(v);
		cvc.value = value;
	};

	return {
		card,
		cvc,
		date,
		errorCard,
		errorDate,
		errorCvc,
		handleCardInput,
		handleDateInput,
		handleCvcInput,
		allCardDetailsAreValid,
	};
}
