<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="active-order-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@willPresent="handlePresentModal"
		>
			<div class="ion-padding modal-content">
				<modal-header title="Order is waiting for you" @close="handleClose">
					<p class="fw-500">
						from <span class="color-primary fw-600">Best company</span>
					</p>
				</modal-header>

				<p class="ion-text-center mt-5 fz-14 color-dark">
					Please show this QR during receiving of your order
				</p>

				<div class="is-flex ion-justify-content-center mt-2">
					<canvas id="canvas"></canvas>
				</div>
				<!-- <div>
					<Button class="mt-2" @click="scan" expand="block">
						Scan
					</Button>
				</div> -->

				<div class="mt-5">
					<CheckoutItem
						v-for="(item, index) in items"
						:key="index"
						:product="item"
						class="mb-2"
						hide-buttons
					></CheckoutItem>

					<h2 class="ion-text-end fz-20 mt-3">Total: {{ totalPrice }} UAN</h2>
					<h3 class="ion-text-end fz-18 mt-3">
						Payment method: <span class="color-primary">Cash</span>
					</h3>

					<div class="pt-5">
						<Button class="mt-5" color="danger" @click="scan" expand="block">
							Cancel order
						</Button>
					</div>
				</div>
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController } from '@ionic/vue';
import { computed, ref } from '@vue/reactivity';
import ModalHeader from '@/components/common/ModalHeader.vue';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import QRCode from 'qrcode';
import Button from '@/components/common/Button.vue';
import useAlert from '@/composables/common/alert.js';

const DEFAULT_ITEMS = [
	{
		price: 50,
		count: 2,
	},
	{
		price: 100,
		count: 1,
	},
];

export default {
	name: 'ActiveOrderModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		CheckoutItem,
		Button,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['complete-order', 'close'],
	setup(_, { emit }) {
		const items = ref(DEFAULT_ITEMS);
		const { showMessage } = useAlert();

		const totalPrice = computed(() => {
			return items.value.reduce((prev, curr) => {
				return curr.count * curr.price + prev;
			}, 0);
		});

		const handleClose = () => {
			modalController.dismiss();
		};

		const handlePresentModal = () => {
			generateQr();
		};

		const generateQr = () => {
			// console.log('generate');
			// console.log(BarcodeScanner);
			// console.log(BarcodeScanner.encode);
			// BarcodeScanner.encode(
			// 	BarcodeScanner.Encode.TEXT_TYPE,
			// 	'Taras',
			// 	(success) => {
			// 		console.log('success');
			// 		console.log(success);
			// 	},
			// 	(fail) => {
			// 		console.log('FAIL');
			// 		console.log(fail);
			// 	}
			// );
			const canvas = document.getElementById('canvas');

			QRCode.toCanvas(canvas, 'sample text', function(error) {
				if (error) console.error(error);
				console.log('success!');
			});
		};

		const scan = () => {
			BarcodeScanner.scan()
				.then((res) => {
					console.log(res.text);
					showMessage({
						color: 'success',
						//text: `Text is: ${res.text}`,
						text: `Order is successfully completed`,
						title: 'Success',
					});

					emit('complete-order');
					handleClose();
				})
				.catch(() => {
					showMessage({
						text: `Something went wrong. Plase try again`,
					});
				});
		};

		return {
			handleClose,
			items,
			totalPrice,
			handlePresentModal,
			scan,
		};
	},
};
</script>

<style lang="scss" scoped>
#canvas {
	width: 200px !important;
	height: 200px !important;
}
</style>

<style lang="scss">
@import '@/theme/mixins.scss';

.active-order-modal {
	@include default-modal-style;
}
</style>
