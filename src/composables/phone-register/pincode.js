import { computed, nextTick, onBeforeUpdate, reactive, ref } from 'vue';

export default function () {
	const values = reactive([
		{
			value: null,
		},
		{
			value: null,
		},
		{
			value: null,
		},
		{
			value: null,
		},
		{
			value: null,
		},
		{
			value: null,
		},
	]);
	const inputs = ref(null);

	const getValueElement = (index) => {
		const el = values[index];

		return el;
	};

	const focusElementByIndex = (index) => {
		const el = inputs.value.querySelector(`#input_${index}`);

		if (!el) {
			return;
		}

		el.focus();
	};

	const handleCodeInput = (item, index) => {
		const prev = item.value;

		setTimeout(() => {
			const value = item.value;

			if (prev && !value) {
				return;
			}

			if (value) {
				focusElementByIndex(index + 1);
			} else {
				const prevElement = getValueElement(index - 1);

				if (prevElement) {
					prevElement.value = null;
				}

				focusElementByIndex(index - 1);
			}
		}, 100);
	};

	const code = computed(() => {
		return values.map((v) => v.value).join('');
	});

	const handleInputFocus = (index) => {
		const emptyIndex = values.findIndex((v) => !v.value);

		if (index === emptyIndex) {
			return;
		}

		if (emptyIndex > -1) {
			focusElementByIndex(emptyIndex);
		}
	};

	const handlePaste = (e, raw) => {
		if (!e) {
			return;
		}

		const pasted = raw
			? e.split('')
			: e.clipboardData.getData('Text').split('');
		const requiredData = pasted.slice(0, values.length);

		const isInvalid = requiredData.some((e) => {
			const curr = +e;

			return !curr && curr !== 0;
		});

		if (isInvalid) {
			return;
		}

		requiredData.forEach((el, index) => {
			values[index].value = el;
		});
	};

	return {
		handleCodeInput,
		code,
		values,
		handleInputFocus,
		handlePaste,
		inputs,
	};
}
