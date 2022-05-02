<template>
	<div class="is-flex ion-wrap">
		<div
			v-for="item in items"
			:key="item.value"
			class="status mb-2"
			:class="{ active: modelValue.includes(item.value) }"
			@click="handleClick(item.value)"
		>
			{{ item.text }}
		</div>
	</div>
</template>

<script>
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
export default {
	name: 'StatusFilter',
	props: {
		options: {
			type: Object,
			default: () => {},
		},
		modelValue: {
			type: [Array],
			default: () => [],
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const { options, modelValue } = toRefs(props);

		const items = computed(() => {
			let res = [];

			Object.keys(options.value).forEach((key) => {
				res.push({
					value: options.value[key],
					text: options.value[key].replaceAll('_', ' '),
				});
			});

			return res;
		});

		const handleClick = (status) => {
			const index = modelValue.value.indexOf(status);
			if (index < 0) {
				emit('update:modelValue', [...modelValue.value, status]);
				return;
			}

			const newV = [...modelValue.value];
			newV.splice(index, 1);
			emit('update:modelValue', newV);
		};

		return {
			items,
			handleClick,
		};
	},
};
</script>

<style lang="scss" scoped>
.status {
	border-radius: 15px;
	padding: 5px 10px;
	background: var(--ion-color-light-shade);
	color: var(--ion-color-dark);
	font-weight: 500;
	font-size: 14px;
	margin-right: 5px;
	text-transform: capitalize;
	transition: all 0.2s;

	&.active {
		background: var(--ion-color-primary);
		color: var(--white);
	}
}
</style>
