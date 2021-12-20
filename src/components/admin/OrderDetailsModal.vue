<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="customer-order-details-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@willPresent="handlePresentModal"
		>
			<div class="ion-padding modal-content">
				<modal-header title="Order #4650" @close="handleClose">
					<p class="fw-500">
						for <span class="color-primary fw-600">Best burger</span>
					</p>
				</modal-header>

				<order-details class="mt-5" />
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController } from '@ionic/vue';
import ModalHeader from '@/components/common/ModalHeader.vue';
import Button from '@/components/common/Button.vue';
import OrderDetails from '@/components/admin/OrderDetails.vue';

export default {
	name: 'OrderDetailsModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		Button,
		OrderDetails,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const handlePresentModal = () => {};

		const handleClose = () => {
			modalController.dismiss();
		};

		return {
			handlePresentModal,
			handleClose,
		};
	},
};
</script>

<style lang="scss">
@import '@/theme/mixins.scss';

.customer-order-details-modal {
	@include default-modal-style;
}
</style>
