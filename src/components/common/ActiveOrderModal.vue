<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="customer-order-details-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@didPresent="handlePresentModal"
			:breakpoints="[0, 0.9, 1]"
			:initialBreakpoint="0.9"
		>
			<div class="ion-padding modal-content">
				<modal-header @close="handleClose">
					<div class="is-flex ion-align-items-center mb-2">
						<div class="logo mr-2">
							<img :src="activeOrder.Company.logo" alt="" />
						</div>
						<h2 class="mt-2 mb-2 color-dark-grey fz-16">
							{{ activeOrder.Company.name }}
						</h2>
					</div>

					<p class="color-dark fz-18">
						Order <span class="fw-600"> #{{ activeOrder.orderNumber }}</span>
					</p>

					<!-- <p class="fw-500">
						from <span class="color-primary fw-600">Best company</span>
					</p> -->
				</modal-header>
				<p class="mt-1 fz-14 color-grey">
					{{ activeOrder.Place.address }}
				</p>

				<div class="is-flex ion-justify-content-end pb-2">
					<p
						class="fz-14 color-primary mt-4 route fw-500 is-flex ion-justify-content-center ion-align-items-center"
						@click="openMaps"
					>
						<ion-icon :icon="locationOutline" class="mr-1" />

						<span> Route </span>
					</p>
				</div>

				<p
					v-if="
						activeOrder.status === ORDER_STATUSES.ACTIVE ||
						activeOrder.status === ORDER_STATUSES.PAYED
					"
					class="ion-text-center mt-5 fz-14 color-dark"
				>
					Please show this QR during receiving of your order
				</p>

				<div
					v-if="
						activeOrder.status === ORDER_STATUSES.ACTIVE ||
						activeOrder.status === ORDER_STATUSES.PAYED
					"
					class="is-flex ion-justify-content-center ion-align-items-center is-flex-direction-column mt-2"
				>
					<canvas id="canvas"></canvas>
					<p class="fw-500 ion-text-center">
						<span class="fw-400 fz-14"> Your private number: <br /> </span>
						<span>
							{{ activeOrder.customerNumber }}
						</span>
					</p>
				</div>
				<!-- <div>
					<Button class="mt-2" @click="scan" expand="block">
						Scan
					</Button>
				</div> -->

				<div class="mt-5">
					<div class="products">
						<swiper :slides-per-view="1.5" :space-between="8" ref="swiper">
							<swiper-slide v-for="slide in products" :key="slide.id">
								<CheckoutItem
									:product="slide"
									class="mb-2"
									hide-buttons
								></CheckoutItem>
							</swiper-slide>
						</swiper>
					</div>

					<hr class="hr" />
					<h2 class="ion-text-end fz-18 mt-3 color-dark">
						Total: {{ totalPrice }} UAH
					</h2>
					<h3 class="ion-text-end fz-14 fw-400 color-grey">
						Payment method: <span>Cash</span>
					</h3>
					<div class="pt-5">
						<div
							v-if="activeOrder.status === ORDER_STATUSES.ACTIVE"
							class="is-flex is-flex-direction-column ion-align-items-center"
						>
							<Button class="action" @click="cancel">
								<ion-icon :icon="closeOutline" class="color-danger" />
							</Button>
							<span class="ion-text-center mt-1 fz-12 color-dark">
								Cancel <br />
								order
							</span>
						</div>
					</div>
				</div>
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController, IonIcon } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';

import { computed, ref, toRefs } from '@vue/reactivity';
import ModalHeader from '@/components/common/ModalHeader.vue';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import QRCode from 'qrcode';
import Button from '@/components/common/Button.vue';
import useAlert from '@/composables/common/alert.js';
import { useStore } from 'vuex';
import useBrowser from '@/composables/common/browser.js';
import useDialog from '@/composables/common/dialog.js';
import { closeOutline } from 'ionicons/icons';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import { ORDER_STATUSES } from '@/config/constants.js';
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
	name: 'ActiveOrderModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		CheckoutItem,
		Button,
		IonIcon,
		Swiper,
		SwiperSlide,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		selectedOrder: {
			type: Object,
			default: () => {},
		},
	},
	emits: ['close'],
	setup(props) {
		const { selectedOrder } = toRefs(props);
		const store = useStore();
		const items = ref([]);
		const { showMessage } = useAlert();
		const { open } = useBrowser();
		const { confirm } = useDialog();
		const { showLoader, hideLoader } = useLoader();

		const openMaps = () => {
			open(
				`http://maps.google.com/?q=${activeOrder.value.Place.latitude},${activeOrder.value.Place.longtitude}`
			);
		};

		const activeOrder = computed(() => {
			if (selectedOrder.value && Object.keys(selectedOrder.value).length) {
				return selectedOrder.value;
			}

			return store.getters['myOrders/activeOrders'][0];
		});

		const products = computed(() => {
			return activeOrder.value.OrderProducts.map((el) => {
				return {
					...el.productData,
					count: el.quantity,
				};
			});
		});

		const totalPrice = computed(() => {
			return activeOrder.value.totalPrice.toFixed(2);
		});

		const handleClose = () => {
			modalController.dismiss();
		};

		const handlePresentModal = () => {
			generateQr();
		};

		const generateQr = () => {
			if (
				activeOrder.value.status !== ORDER_STATUSES.ACTIVE &&
				activeOrder.value.status !== ORDER_STATUSES.PAYED
			) {
				return;
			}

			const canvas = document.getElementById('canvas');

			QRCode.toCanvas(
				canvas,
				JSON.stringify({ id: activeOrder.value.customerNumber }),
				function (error) {
					if (error) console.error(error);
				}
			);
		};

		const cancel = async () => {
			const result = await confirm({
				message: 'Are you sure you want to cancel order?',
			});

			if (!result) {
				return;
			}

			showLoader();

			http
				.delete(`/orders/${activeOrder.value.id}/cancel`)
				.then(() => {
					store.commit('myOrders/updateOrderStatus', {
						order: activeOrder.value,
						status: ORDER_STATUSES.CANCELLED,
					});

					showMessage({
						color: 'success',
						text: `Order is successfully cancelled`,
						title: 'Success',
					});

					handleClose();
				})
				.catch(() => {
					showMessage({
						text: `Something went wrong. Please try again`,
					});
				})
				.finally(() => {
					hideLoader();
				});
		};

		// const scan = () => {
		// 	BarcodeScanner.scan()
		// 		.then((res) => {
		// 			console.log(res.text);
		// 			showMessage({
		// 				color: 'success',
		// 				text: `Order is successfully completed`,
		// 				title: 'Success',
		// 			});

		// 			emit('complete-order');
		// 			handleClose();
		// 		})
		// 		.catch(() => {
		// 			showMessage({
		// 				text: `Something went wrong. Please try again`,
		// 			});
		// 		});
		// };

		return {
			handleClose,
			items,
			totalPrice,
			handlePresentModal,
			products,
			activeOrder,
			locationOutline,
			openMaps,
			cancel,
			closeOutline,
			ORDER_STATUSES,
		};
	},
};
</script>

<style lang="scss" scoped>
#canvas {
	width: 15vh !important;
	height: 15vh !important;
	max-width: 200px;
	max-height: 200px;
}

.logo {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
	}
}

.route {
	padding: 5px 10px;
	border-radius: 30px;
	box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 10%);
	background: var(--white);
	width: 80px;
	transition: all 0.2s ease;

	&:hover {
		background: var(--ion-color-light);
	}
}

.action {
	width: 50px;
	height: 50px;
	padding: 0;
	--padding-bottom: 0;
	--padding-end: 0;
	--padding-start: 0;
	--padding-top: 0;
	font-size: 14px;
	margin-right: 20px;
	box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 3%);
	border-radius: 50%;
	--background: var(--white);
	--background-activated: var(--ion-color-light) !important;
	border-radius: 50%;

	&:last-of-type {
		margin-right: 0;
	}
}

.hr {
	border-bottom: 1px solid var(--ion-color-light-shade);
}
</style>

<style lang="scss">
@import '@/theme/mixins.scss';

.customer-order-details-modal {
	@include default-modal-style;
}
</style>
