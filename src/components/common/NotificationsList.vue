<template>
	<div class="notifications-list w-100 ion-padding-start ion-padding-end">
		<div>
			<transition-group name="notification">
				<default-notification
					v-for="(order, index) in orders"
					:key="order.key"
					:title="order.title"
					:subtitle="order.subtitle"
					class="mb-2"
					@close="handleCloseNotification(index)"
					@select="showModal(order, index)"
				/>
			</transition-group>
		</div>

		<order-details-modal
			:is-open="showOrderDetails"
			@close="showOrderDetails = false"
			:data="activeOrder"
			fetch
		/>
	</div>
</template>

<script>
import DefaultNotification from '@/components/common/DefaultNotification.vue';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal.vue';
import { ref } from '@vue/reactivity';
import realtime from '@/services/firebase/db.js';
import { REALTIME_CHANNELS } from '@/config/constants.js';
import { watch } from '@vue/runtime-core';
import { ORDER_STATUSES } from '@/config/constants.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';

export default {
	name: 'NotificationsList',
	components: {
		DefaultNotification,
		OrderDetailsModal,
	},
	setup() {
		const showOrderDetails = ref(false);
		const orders = ref([]);
		const activeOrder = ref(null);
		const { activePlace } = useCurrentPlace();

		const handleCloseNotification = (index) => {
			orders.value.splice(index, 1);
		};

		const handleMessage = (data) => {
			if (data.key === 'new') {
				orders.value.unshift({
					title: `New incoming order`,
					subtitle: `#${data.data.orderNumber}. Payment method: ${data.data.paymentMethod}`,
					id: data.data.id,
					status: [ORDER_STATUSES.TO_TAKE, ORDER_STATUSES.PAYED],
					key: new Date(),
					data: data.data,
				});

				return;
			}

			if (data.key === 'cancelled') {
				orders.value.unshift({
					title: `Order cancellation`,
					subtitle: `Order #${data.data.orderNumber} was cancelled by customer`,
					id: data.data.id,
					status: [ORDER_STATUSES.CANCELLED],
					key: new Date(),
					data: data.data,
				});

				return;
			}
		};

		const showModal = (order, index) => {
			activeOrder.value = order;
			showOrderDetails.value = true;
			handleCloseNotification(index);
		};

		watch(
			() => {
				return activePlace.value;
			},
			(newV, oldV) => {
				if (oldV) {
					realtime.unsubscribe(
						'new',
						handleMessage,
						`${REALTIME_CHANNELS.PLACE_NEW.replace('{placeId}', oldV)}`
					);

					realtime.unsubscribe(
						'cancelled',
						handleMessage,
						`${REALTIME_CHANNELS.PLACE_NEW.replace('{placeId}', oldV)}`
					);
				}

				if (newV) {
					realtime.onready(() => {
						realtime.subscribe(
							'new',
							handleMessage,
							`${REALTIME_CHANNELS.PLACE_NEW.replace(
								'{placeId}',
								activePlace.value
							)}`
						);

						realtime.subscribe(
							'cancelled',
							handleMessage,
							`${REALTIME_CHANNELS.PLACE_NEW.replace(
								'{placeId}',
								activePlace.value
							)}`
						);
					});
				}
			},
			{
				immediate: true,
			}
		);

		// onMounted(() => {
		// 	placeId = activePlace.value;
		// });

		// onBeforeUnmount(() => {
		// 	placeId = null;
		// });

		return {
			showOrderDetails,
			orders,
			activeOrder,

			handleCloseNotification,
			showModal,
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
