<template>
	<div>
		<order-completed-modal
			v-model="showOrderCompletedModal"
			@update:modelValue="handleClose"
			:details="orderDetails"
		/>
	</div>
</template>

<script>
import OrderCompletedModal from '@/components/orders/OrderCompletedModal.vue';
import { ref } from '@vue/reactivity';
import { computed, onBeforeUnmount, onMounted } from '@vue/runtime-core';
import { ORDER_STATUSES } from '@/config/constants.js';
import { modalController } from '@ionic/vue';
import useHaptics from '@/composables/common/haptics.js';
import { useStore } from 'vuex';
import realtime from '@/services/firebase/db.js';
import { REALTIME_CHANNELS } from '@/config/constants.js';

export default {
	name: 'Modals',
	components: {
		OrderCompletedModal,
	},
	setup() {
		const store = useStore();
		const showOrderCompletedModal = ref(false);
		const orderDetails = ref({});
		const { hapticsImpactHeavy } = useHaptics();

		const activeOrders = computed(() => {
			return store.state.myOrders.orders;
		});

		const handleMessage = (data) => {
			const status = data.data.status;

			if (status === ORDER_STATUSES.COMPLETED) {
				const orderIndex = activeOrders.value.findIndex(
					(o) => o.id === data.data.id
				);

				if (orderIndex >= 0) {
					const newOrders = [...activeOrders.value];
					newOrders.splice(orderIndex, 1, {
						...activeOrders.value[orderIndex],
						status: ORDER_STATUSES.COMPLETED,
					});

					store.commit('myOrders/updateMyOrders', newOrders);
				}

				modalController.dismiss();
				setTimeout(() => {
					orderDetails.value = data.data;
					showOrderCompletedModal.value = true;
					hapticsImpactHeavy();
				}, 100);
			}
		};

		onMounted(() => {
			realtime.onready(() => {
				realtime.subscribe(REALTIME_CHANNELS.ORDERS, handleMessage);
			});
		});

		onBeforeUnmount(() => {
			realtime.unsubscribe(REALTIME_CHANNELS.ORDERS, handleMessage);
		});

		const handleClose = () => {
			orderDetails.value = {};
		};

		return {
			showOrderCompletedModal,
			orderDetails,
			handleClose,
		};
	},
};
</script>
