<template>
	<span
		class="badge fz-12 fw-500 px-3"
		:style="{ background: `var(--ion-color-${color})` }"
		ref="el"
	>
		<slot></slot>
	</span>
</template>

<script>
import { ref } from '@vue/reactivity';
export default {
	name: 'Badge',
	props: {
		color: {
			type: String,
			default: null,
		},
	},
	setup() {
		const el = ref(null);

		return { el };
	},
};
</script>

<style lang="scss" scoped>
.badge {
	display: inline-block;
	border-radius: 10px;
	color: var(--white);
}
</style>
