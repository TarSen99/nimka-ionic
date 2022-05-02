<template>
	<div>
		<div class="w-100">
			<div class="item">
				<div class="field-title">Order created at:</div>

				<div>
					<span class="field-value">{{ createdAt }}</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">Payment method:</div>

				<div>
					<span class="field-value capitalized">{{
						details.paymentMethod
					}}</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">Status:</div>

				<div>
					<product-status-badge :status="details.status" />
				</div>
			</div>

			<div>
				<swiper :slides-per-view="1.5" :space-between="8" ref="swiper">
					<swiper-slide v-for="item in products" :key="item.id">
						<CheckoutItem
							:product="item"
							:disabled="true"
							hide-buttons
							class="mb-2"
						></CheckoutItem>
					</swiper-slide>
				</swiper>
			</div>

			<div>
				<hr class="hr" />

				<div v-if="details.Customer.name" class="item">
					<div class="field-title">Customer name:</div>

					<div>
						<span class="field-value">{{ details.Customer.name }}</span>
					</div>
				</div>

				<div class="item">
					<div class="field-title">Customer mobile:</div>

					<div>
						<span class="field-value">{{ customerPhoneNumber }}</span>
					</div>
				</div>
			</div>
		</div>

		<div>
			<hr class="hr" />
			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Total price:</div>

				<div>
					<span class="field-value">
						{{ details.totalPrice.toFixed(2) }} UAH
					</span>
				</div>
			</div>

			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Comission:</div>

				<div>
					<span class="field-value">-{{ comissionPrice }} UAH</span>
				</div>
			</div>

			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Total income:</div>

				<div>
					<span class="field-value total-income fw-500">+{{ income }} UAH</span>
				</div>
			</div>
		</div>

		<div class="is-flex is-flex-direction-column">
			<div class="is-flex ion-justify-content-center mt-3 pb-2">
				<div
					v-if="
						details.status === ORDER_STATUSES.PAYED ||
						details.status === ORDER_STATUSES.TO_TAKE
					"
					class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
				>
					<Button @click="showActionSheet" class="action">
						<ion-icon :icon="checkmarkOutline" class="color-success" />
					</Button>
					<span class="ion-text-center mt-1 fz-12 color-dark">
						Complete <br />
						order
					</span>
				</div>

				<div
					class="is-flex is-flex-direction-column ion-align-items-center"
					:class="{
						'mr-5': details.status !== ORDER_STATUSES.CANCELLED,
						'pr-5': details.status !== ORDER_STATUSES.CANCELLED,
					}"
				>
					<Button class="action" @click="callCustomer">
						<ion-icon :icon="callOutline" class="color-secondary" />
					</Button>
					<span class="ion-text-center mt-1 fz-12 color-dark">
						Call <br />
						customer
					</span>
				</div>
				<div
					v-if="
						details.status !== ORDER_STATUSES.CANCELLED &&
						details.status !== ORDER_STATUSES.ACTIVE
					"
					class="is-flex is-flex-direction-column ion-align-items-center"
				>
					<Button class="action" @click="handleCancel">
						<ion-icon :icon="closeOutline" class="color-danger" />
					</Button>
					<span
						v-if="
							details.status === ORDER_STATUSES.PAYED ||
							details.status === ORDER_STATUSES.TO_TAKE
						"
						class="ion-text-center mt-1 fz-12 color-dark"
					>
						Cancel <br />
						order
					</span>
					<span
						v-else-if="details.status === ORDER_STATUSES.COMPLETED"
						class="ion-text-center mt-1 fz-12 color-dark"
					>
						Cancel <br />
						& Refund <br />
						order
					</span>
				</div>
			</div>

			<p
				v-if="
					details.status === ORDER_STATUSES.PAYED ||
					details.status === ORDER_STATUSES.TO_TAKE
				"
				class="ion-text-center field-value color-dark mt-5 pt-5"
			>
				Please ask customer to show QR code and scan it by clicking on "Complete
				order" button. <br />

				Customer needs to pickup order till
				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-14"> {{ productsPickupTime }} </span>
				</Badge>
				or it will be automatically cancelled.
			</p>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import useAlert from '@/composables/common/alert.js';
import { modalController, IonIcon } from '@ionic/vue';
import { checkmarkOutline, callOutline, closeOutline } from 'ionicons/icons';
import { DateTime } from 'luxon';
import { computed, toRefs } from '@vue/runtime-core';
import ProductStatusBadge from '@/components/admin/ProductStatusBadge.vue';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import useBrowser from '@/composables/common/browser.js';
import useCancelOrder from '@/composables/product/useCancelOrder.js';
import useLoader from '@/composables/common/useLoader.js';
import { ORDER_STATUSES } from '@/config/constants.js';
import useCompleteOrder from '@/composables/product/completeOrder.js';
import { getProductsPickupTime } from '@/helpers/index.js';

export default {
	name: 'OrderDetails',
	components: {
		Button,
		Badge,
		IonIcon,
		ProductStatusBadge,
		CheckoutItem,
		Swiper,
		SwiperSlide,
	},
	props: {
		details: {
			type: Object,
			default: () => {},
		},
	},
	emits: ['change-status'],
	setup(props, { emit }) {
		const { details } = toRefs(props);
		const { showMessage } = useAlert();
		const { open } = useBrowser();
		const { showLoader, hideLoader } = useLoader();

		const handleClose = () => {
			modalController.dismiss();
		};

		const { cancel } = useCancelOrder({
			activeOrder: details,
		});
		const { showActionSheet } = useCompleteOrder({
			handleClose,
			details,
			emit,
		});

		const createdAt = computed(() => {
			return DateTime.fromISO(details.value.createdAt).toFormat('DD HH:mm');
		});

		const comissionPrice = computed(() => {
			const comission =
				(details.value.totalPrice / 100) * details.value.comission;
			return comission && comission.toFixed(2);
		});

		const income = computed(() => {
			return (details.value.totalPrice - comissionPrice.value).toFixed(2);
		});

		const products = computed(() => {
			return details.value.OrderProducts.map((p) => {
				return {
					...p.productData,
					count: p.quantity,
				};
			});
		});

		const productsPickupTime = computed(() => {
			return getProductsPickupTime(products.value);
		});

		const handleCancel = () => {
			cancel(showLoader)
				.then((res) => {
					if (!res) {
						return;
					}

					emit('change-status', ORDER_STATUSES.CANCELLED);

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

		const customerPhoneNumber = computed(() => {
			return details.value.Customer.phone.slice(
				2,
				details.value.Customer.phone.length
			);
		});

		const callCustomer = () => {
			open(`tel:${customerPhoneNumber.value}`);
		};

		return {
			checkmarkOutline,
			callOutline,
			closeOutline,
			createdAt,
			comissionPrice,
			income,
			products,
			customerPhoneNumber,
			callCustomer,
			handleCancel,
			ORDER_STATUSES,
			showActionSheet,
			productsPickupTime,
		};
	},
};
</script>

<style lang="scss" scoped>
.field-title {
	font-size: 14px;
	color: #a4a4a4;
}

.field-value {
	font-size: 14px;
	color: var(--ion-color-dark);
	font-weight: 400;
}

.hr {
	background: #f2f2f2;
	max-width: 90%;
	margin: auto;
	margin-top: 10px;
	margin-bottom: 10px;
}

.item {
	margin-bottom: 5px;
}

.total-income {
	font-size: 16px;
	font-weight: 500;
}

.bottom {
	color: var(--ion-color-dark);
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
</style>
