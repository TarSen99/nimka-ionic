<template>
	<div class="notifications-list w-100 ion-padding-start ion-padding-end">
		<div>
			<transition-group name="notification">
				<default-notification
					v-for="(order, index) in orders"
					:key="index"
					:title="`New order just came for ${order.key}`"
					subtitle="#5630 from Taras Seniv. You can view details on Orders page"
					color-title="best burger"
					:actions="actions"
					class="mb-2"
					@close="handleCloseNotification(index)"
				/>
			</transition-group>
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
import { computed, reactive, ref } from '@vue/reactivity';
import { useStore } from 'vuex';

const ORDERS = [];

export default {
	name: 'NotificationsList',
	components: {
		DefaultNotification,
		OrderDetailsModal,
	},
	setup() {
		const showOrderDetails = ref(false);
		const orders = reactive(ORDERS);
		const store = useStore();

		const handleCloseNotification = (index) => {
			orders.splice(index, 1);
		};

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
				type: 'close',
			},
		];

		const isPartner = computed(() => {
			return store.state.user.role === 'employee';
		});

		if (isPartner.value) {
			// setTimeout(() => {
			// 	orders.push({ key: 2 });
			// }, 2000);
		}

		return {
			actions,
			showOrderDetails,
			orders,
			handleCloseNotification,
		};
	},
};
</script>

<style lang="scss" scoped>
.notifications-list {
	position: fixed;
	top: calc(20px + var(--ion-safe-area-top));
	width: 100%;
	z-index: 2;
}
</style>
