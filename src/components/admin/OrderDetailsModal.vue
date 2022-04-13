<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="customer-order-details-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@willPresent="handlePresentModal"
			:breakpoints="[0, 0.9]"
			:initialBreakpoint="0.9"
		>
			<div class="ion-padding modal-content">
				<div class="is-flex">
					<div class="logo mr-4">
						<img src="@/assets/images/logo.png" alt="" />
					</div>
					<modal-header class="w-100" title="Order #4650" @close="handleClose">
						<p class="fw-400 fz-14">
							for <span class="color-primary">Best burger</span>
						</p>
					</modal-header>
				</div>

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

.customer-order-details-modal {
	.logo {
		width: 40px;
		height: 40px;
		overflow: hidden;
		border-radius: 10px;
	}
}
</style>
