<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="modelValue"
			:swipe-to-close="true"
			mode="ios"
			css-class="order-completed-modal"
			:breakpoints="[0, 0.5, 0.8]"
			:initialBreakpoint="0.8"
			@willDismiss="handleClose"
		>
			<div
				class="ion-padding modal-content is-flex is-flex-direction-column ion-justify-content-between"
			>
				<div>
					<div class="is-flex ion-justify-content-center">
						<span class="success-mark">
							<ion-icon
								:icon="checkmarkOutline"
								class="icon"
								color="light"
							></ion-icon>
						</span>
					</div>

					<div class="mt-2">
						<p class="ion-text-center fw-400 fz-18 color-success fw-500">
							Success
						</p>
						<p class="ion-text-center fw-400 fz-16 color-dark-grey mt-5">
							Order #{{ details.orderNumber }} was completed. <br />
							<span class="fw-500"> Bon appetit! </span>
						</p>
					</div>
				</div>

				<div class="is-flex ion-justify-content-center">
					<Button color="primary" @click="handleClose">
						<span class="px-5"> Thank you </span>
					</Button>
				</div>
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController, IonIcon } from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';
import Button from '@/components/common/Button.vue';

export default {
	name: 'OrderCompletedModal',
	components: {
		IonModal,
		IonContent,
		modalController,
		IonIcon,
		Button,
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},
		details: {
			type: Object,
			default: () => {},
		},
	},
	setup(_, { emit }) {
		const handleClose = () => {
			emit('update:modelValue', false);
		};

		return {
			checkmarkOutline,
			handleClose,
		};
	},
};
</script>

<style lang="scss" scoped>
.success-mark {
	font-size: 50px;
	background-color: var(--ion-color-success);
	width: 70px;
	height: 70px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-content {
	padding-top: 30px;
	height: 400px;
	background: var(--white);
}
</style>

<style lang="scss">
.order-completed-modal {
	&::part(content) {
		background-color: var(--white) !important;
	}
}
</style>
