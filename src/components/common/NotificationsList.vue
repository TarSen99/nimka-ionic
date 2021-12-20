<template>
	<div class="w-100 ion-padding-start ion-padding-end">
		<div>
			<default-notification
				v-for="(order, index) in ORDERS"
				:key="index"
				title="New order just came for"
				subtitle="#5630 from Taras Seniv. You can view details on Orders page"
				color-title="best burger"
				:actions="actions"
				class="mb-2"
			/>
		</div>

		<order-details-modal
			:is-open="showOrderDetails"
			@close="showOrderDetails = false"
		/>
	</div>
</template>

<script>
import DefaultNotification from '@/components/common/DefaultNotification.vue';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal.vue';
import { ref } from '@vue/reactivity';

const ORDERS = [2];

export default {
	name: 'NotificationsList',
	components: {
		DefaultNotification,
		OrderDetailsModal,
	},
	setup(_, { emit }) {
		const showOrderDetails = ref(false);

		const actions = [
			{
				title: 'View details',
				color: 'primary',
				handler() {
					showOrderDetails.value = true;
				},
			},
			{
				title: 'Close',
				color: 'danger',
				handler() {
					emit('close');
				},
			},
		];

		return {
			actions,
			showOrderDetails,
			ORDERS,
		};
	},
};
</script>
