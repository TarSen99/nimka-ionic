import { ref } from 'vue';

const CODE_LENGTH = 6;
export default function () {
	const codeEl = ref(null);
	const currentPin = ref('');

	const focusMainElement = () => {
		const el = codeEl.value;

		el.focus();
	};

	const handlePaste = (e, raw) => {
		if (!e) {
			return;
		}

		const pasted = raw ? e : e.clipboardData.getData('Text');
		const requiredData = pasted.slice(0, CODE_LENGTH);

		currentPin.value = requiredData;
	};

	return {
		handlePaste,
		codeEl,
		focusMainElement,
		currentPin,
		CODE_LENGTH,
	};
}
