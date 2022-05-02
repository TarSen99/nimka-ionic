<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="customer-order-details-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			:breakpoints="[0, 0.9, 1]"
			:initialBreakpoint="0.9"
		>
			<div class="ion-padding modal-content">
				<div
					v-if="Object.keys(currentDetails).length"
					class="is-flex ion-align-items-center"
				>
					<div class="logo color-dark">
						<ion-icon :icon="personCircleOutline" class="fz-30"></ion-icon>
					</div>
					<modal-header
						class="w-100"
						:title="`Order #${currentDetails.orderNumber}`"
						@close="handleClose"
					>
					</modal-header>
				</div>

				<order-details
					v-if="Object.keys(currentDetails).length"
					class="mt-5"
					:details="currentDetails"
					@change-status="$emit('change-status', $event)"
				/>
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController, IonIcon } from '@ionic/vue';
import ModalHeader from '@/components/common/ModalHeader.vue';
import Button from '@/components/common/Button.vue';
import OrderDetails from '@/components/admin/OrderDetails.vue';
import { personCircleOutline } from 'ionicons/icons';
import { ref, toRefs } from '@vue/reactivity';
import { useStore } from 'vuex';
import { computed, watch } from '@vue/runtime-core';
import useLoader from '@/composables/common/useLoader.js';

export default {
	name: 'OrderDetailsModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		Button,
		OrderDetails,
		IonIcon,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		details: {
			type: Object,
			default: () => {},
		},
		data: {
			type: Object,
			default: () => {},
		},
		fetch: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		const store = useStore();
		const { showLoader, hideLoader } = useLoader();

		const { details, fetch, isOpen, data } = toRefs(props);
		const savedDetails = ref({});

		const orders = computed(() => {
			return store.state.placeOrders.orders;
		});

		const currentDetails = computed(() => {
			if (!fetch.value) {
				return details.value || {};
			}

			return savedDetails.value || {};
		});

		const handleClose = () => {
			modalController.dismiss();
			emit('close');
		};

		watch(
			() => {
				return isOpen.value;
			},
			async (newV) => {
				if (!newV) {
					savedDetails.value = {};
					return;
				}

				if (!fetch.value) {
					return;
				}

				// let order = orders.value.find((el) => el.id === data.value.id);

				// if (order) {
				// 	order.status = data.value.data.status;
				// 	savedDetails.value = order;
				// 	return;
				// }

				await showLoader();

				store
					.dispatch('placeOrders/getOrderDetails', {
						orderId: data.value.id,
					})
					.then((data) => {
						savedDetails.value = data;

						hideLoader();
					})
					.catch(() => {
						hideLoader();
					});
			}
		);

		return {
			handleClose,
			personCircleOutline,
			currentDetails,
		};
	},
};
</script>

<style lang="scss">
@import '@/theme/mixins.scss';

.customer-order-details-modal {
	@include default-modal-style;
}

.customer-order-details-modal {
	.logo {
		width: 40px;
		height: 40px;
		overflow: hidden;
		border-radius: 10px;
	}
}
</style>
