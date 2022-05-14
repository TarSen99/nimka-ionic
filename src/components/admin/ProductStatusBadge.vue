<template>
	<Badge :class="statusClass" class="px-3">
		<span class="fz-14 capitalized">
			{{ t(`${translationKey}.${status}`) }}
			<!-- {{ status && status.replaceAll('_', ' ') }} -->
		</span>
	</Badge>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n/index';

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
		translationKey: {
			type: String,
			default: 'product_status',
		},
	},
	setup(props) {
		const { status } = toRefs(props);
		const { t } = useI18n();

		const statusClass = computed(() => {
			const v = status.value || '';
			return v.replaceAll(' ', '_');
		});

		return {
			statusClass,
			t,
		};
	},
};
</script>

<style lang="scss" scoped>
.active,
.to_take,
.payed,
.completed {
	background-color: var(--ion-color-success) !important;
}

.unpublished,
.pending {
	background-color: var(--ion-color-primary) !important;
}

.out_of_stock {
	background-color: var(--ion-color-primary) !important;
}

.expired,
.cancelled {
	background-color: var(--ion-color-danger) !important;
}
</style>
