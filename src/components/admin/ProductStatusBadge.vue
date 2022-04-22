<template>
	<Badge :class="statusClass" class="px-3">
		<span class="fz-14 capitalized">
			{{ status }}
		</span>
	</Badge>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

export default {
	name: 'ProductStatusBadge',
	components: {
		Badge,
	},
	props: {
		status: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const { status } = toRefs(props);

		const statusClass = computed(() => {
			const v = status.value || '';
			return v.replaceAll(' ', '_');
		});

		return {
			statusClass,
		};
	},
};
</script>

<style lang="scss" scoped>
.active {
	background-color: var(--ion-color-success) !important;
}

.unpublished {
	background-color: var(--ion-color-primary) !important;
}

.out_of_stock {
	background-color: var(--ion-color-primary) !important;
}

.expired {
	background-color: var(--ion-color-danger) !important;
}
</style>
