<template>
	<div id="payment"></div>
</template>

<script>
import { toRefs } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
export default {
	name: 'PaymentSystem',
	props: {
		paymentUrl: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const { paymentUrl } = toRefs(props);

		watch(
			() => paymentUrl.value,
			(newV) => {
				if (!newV) {
					return;
				}
			}
		);
	},
};
</script>
