<template>
	<div class="modal">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="customer-order-details-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@didPresent="handlePresentModal"
			:breakpoints="[0, 0.9, 1]"
			:initialBreakpoint="0.9"
			ref="container"
		>
			<div
				v-if="activeOrder && Object.keys(activeOrder).length"
				class="ion-padding modal-content"
			>
				<modal-header @close="handleClose">
					<div class="is-flex ion-align-items-center mb-2">
						<div class="logo mr-2">
							<img :src="activeOrder.Company.logo" alt="" />
						</div>
						<h2 class="mt-2 mb-2 color-dark fz-16">
							{{ activeOrder.Company.name }}
						</h2>
					</div>

					<p class="color-dark fz-14">
						Order <span class="fw-600"> #{{ activeOrder.orderNumber }}</span>
					</p>

					<div class="fz-14 color-dark">
						Pick up time:
						<span class="fw-600">
							{{ productsPickupTimeFrom }} - {{ productsPickupTime }}</span
						>
					</div>

					<!-- <p class="fw-500">
						from <span class="color-primary fw-600">Best company</span>
					</p> -->
				</modal-header>

				<div
					class="is-flex ion-justify-content-between ion-align-items-start mb-5 pb-5"
				>
					<p class="mt-3 fz-14 color-grey pr-4">
						{{ activeOrder && activeOrder.Place && activeOrder.Place.address }}
					</p>

					<div class="is-flex ion-justify-content-end pb-2 mt-2">
						<p
							class="fz-14 mt-1 color-dark route fw-500 is-flex ion-justify-content-center ion-align-items-center"
							@click="openMaps"
						>
							<ion-icon :icon="locationOutline" class="mr-1" />

							<span> Route </span>
						</p>
					</div>
				</div>

				<p
					v-if="
						activeOrder.status === ORDER_STATUSES.PAYED ||
						activeOrder.status === ORDER_STATUSES.TO_TAKE
					"
					class="ion-text-center mt-5 fz-14 color-dark"
				>
					Please show this QR during receiving of your order
				</p>

				<div
					v-if="
						activeOrder.status === ORDER_STATUSES.TO_TAKE ||
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
					<h3 class="ion-text-end fz-14 fw-400 color-grey mt-3">
						Payment method:
						<span class="payment-method fz-16 fw-500">
							{{ activeOrder.paymentMethod }}
						</span>
					</h3>
					<h2 class="ion-text-end mt-1 fz-18 color-dark">
						Total: <span class="fz-20 fw-500"> {{ totalPrice }} UAH </span>
					</h2>
					<div class="pt-5 is-flex ion-justify-content-center">
						<div
							v-if="showCancelButton"
							class="is-flex is-flex-direction-column ion-align-items-center"
						>
							<Button class="action" @click="handleCancel">
								<ion-icon :icon="closeOutline" class="color-danger" />
							</Button>
							<span class="ion-text-center mt-1 fz-16 color-dark fw-500">
								Cancel <br />
								order
							</span>
						</div>

						<div
							v-if="activeOrder.status === ORDER_STATUSES.ACTIVE"
							class="is-flex is-flex-direction-column ion-align-items-center ml-5 pl-5"
						>
							<Button class="action" @click="finishPayment(activeOrder)">
								<ion-icon :icon="cashOutline" class="color-success" />
							</Button>
							<span class="ion-text-center mt-1 fz-16 color-dark fw-500">
								Finish <br />
								Payment
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
import { locationOutline, cashOutline } from 'ionicons/icons';

import { computed, ref, toRefs } from '@vue/reactivity';
import ModalHeader from '@/components/common/ModalHeader.vue';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import QRCode from 'qrcode';
import Button from '@/components/common/Button.vue';
import useAlert from '@/composables/common/alert.js';
import { useStore } from 'vuex';
import useBrowser from '@/composables/common/browser.js';
import { closeOutline } from 'ionicons/icons';
import useLoader from '@/composables/common/useLoader.js';
import { ORDER_STATUSES } from '@/config/constants.js';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRouter } from 'vue-router';
import { DateTime } from 'luxon';
import useCancelOrder from '@/composables/product/useCancelOrder.js';
import {
	getProductsPickupDate,
	getProductsPickupTime,
	getProductsPickupTimeFrom,
} from '@/helpers';

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
		const { selectedOrder, isOpen } = toRefs(props);
		const store = useStore();
		const router = useRouter();
		const items = ref([]);
		const container = ref(null);
		const { showMessage } = useAlert();
		const { open } = useBrowser();
		const { showLoader, hideLoader } = useLoader();

		const activeOrder = computed(() => {
			if (selectedOrder.value && Object.keys(selectedOrder.value).length) {
				return selectedOrder.value || {};
			}

			return store.getters['myOrders/activeOrders'][0] || {};
		});

		const { cancel } = useCancelOrder({
			activeOrder,
		});

		const handleClose = () => {
			modalController.dismiss();
		};

		const handleCancel = () => {
			cancel(showLoader)
				.then((res) => {
					if (!res) {
						return;
					}

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

		const openMaps = () => {
			open(
				`http://maps.google.com/?q=${activeOrder.value.Place.location.coordinates[1]},${activeOrder.value.Place.location.coordinates[0]}`
			);
		};

		const products = computed(() => {
			return activeOrder.value.OrderProducts.map((el) => {
				return {
					...el.productData,
					count: el.quantity,
				};
			});
		});

		const totalPrice = computed(() => {
			return (activeOrder.value.totalPrice || 0).toFixed(2);
		});

		const handlePresentModal = () => {
			generateQr();
		};

		const generateQr = () => {
			if (
				activeOrder.value.status !== ORDER_STATUSES.TO_TAKE &&
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

		const finishPayment = (order) => {
			router.push(`/payment?orderId=${order.id}`);
			handleClose();
		};

		const checkIfDiffLessThenOneHour = (a, b) => {
			const aDate = DateTime.fromJSDate(a);
			const bDate = DateTime.fromJSDate(b);

			const diff = aDate.diff(bDate, ['hours']).toObject();

			const { hours } = diff;

			return hours < 1;
		};

		const pickupTime = computed(() => {
			const products = activeOrder.value.OrderProducts.map(
				(p) => p.productData
			);

			const pickupTime = getProductsPickupDate(products);

			return pickupTime;
		});

		const productsPickupTime = computed(() => {
			const products = activeOrder.value.OrderProducts.map(
				(p) => p.productData
			);

			return getProductsPickupTime(products);
		});

		const productsPickupTimeFrom = computed(() => {
			const products = activeOrder.value.OrderProducts.map(
				(p) => p.productData
			);

			return getProductsPickupTimeFrom(products);
		});

		const showCancelButton = computed(() => {
			if (
				activeOrder.value.status === ORDER_STATUSES.ACTIVE ||
				activeOrder.value.status === ORDER_STATUSES.TO_TAKE
			) {
				return true;
			}

			if (activeOrder.value.status === ORDER_STATUSES.PAYED) {
				return !checkIfDiffLessThenOneHour(
					new Date(pickupTime.value),
					new Date()
				);
			}

			return false;
		});

		return {
			handleClose,
			items,
			totalPrice,
			handlePresentModal,
			products,
			activeOrder,
			locationOutline,
			openMaps,
			closeOutline,
			ORDER_STATUSES,
			finishPayment,
			cashOutline,
			showCancelButton,
			productsPickupTime,
			productsPickupTimeFrom,
			handleCancel,
			container,
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

.payment-method {
	text-transform: capitalize;
}
</style>

<style lang="scss">
@import '@/theme/mixins.scss';

.customer-order-details-modal {
	@include default-modal-style;
}
</style>
