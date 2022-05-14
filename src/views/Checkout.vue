<template>
	<ion-page>
		<ion-header mode="md" class="header">
			<ion-toolbar mode="md" class="toolbar" color="primary">
				<div
					ref="header"
					class="is-flex ion-justify-content-between w-100 ion-align-items-center px-4 header-content relative"
				>
					<ion-buttons>
						<ion-button
							class="back-btn default-icon-btn"
							ref="backButton"
							@click.prevent="$router.back()"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<ion-title class="ion-text-center">
						{{ t('checkout.title') }}
					</ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding">
			<div
				class="content is-flex is-flex-direction-column ion-justify-content-between"
			>
				<div>
					<div class="is-flex ion-align-items-center mb-2">
						<div class="logo mr-2">
							<img :src="company.logo" alt="" />
						</div>
						<h2 class="mt-2 mb-2 color-dark fz-18">
							{{ t('checkout.order_from') }} {{ company.name }}
						</h2>
					</div>
					<CheckoutItem
						v-for="(item, index) in products"
						:key="index"
						:product="item"
						:total-products-count="products.length"
						:disabled="!editProductsAvailable"
						class="mb-2"
						@change-count="handleChangeCount($event, item)"
					></CheckoutItem>

					<h2 class="ion-text-end fz-20 mt-3">
						{{ t('active_order.total') }} : {{ totalPrice }}
						{{ t('common.uah') }}
					</h2>

					<Payment
						class="mt-5 pt-5"
						:cards="cards"
						@payment-type="handlePaymentTypeChange"
						@payment-card="handlePaymentCardChange"
						@add-new="addNewCard"
					/>
				</div>

				<div class="mt-5">
					<Button
						color="primary"
						expand="block"
						class="order"
						@click="handleOrderClick"
						:disabled="orderBtnIsDisabled || isLoading"
					>
						{{ t('checkout.approve') }} {{ totalPrice }} {{ t('common.uah') }}
					</Button>
				</div>
			</div>

			<!-- <ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
				<div class="order-container ion-padding w-100"></div>
			</ion-fab> -->
		</ion-content>

		<ErrorModal
			:is-open="isOpen"
			:error-data="errorData"
			:products="products"
			@close="onClose"
		/>
	</ion-page>
</template>

<script>
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
	IonTitle,
	IonFab,
	onIonViewWillEnter,
	onIonViewDidLeave,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
import Payment from '@/components/checkout/Payment.vue';
import { ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import { useRouter } from 'vue-router';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import ErrorModal from '@/components/checkout/ErrorModal.vue';
import useErrorModal from '@/composables/checkout/errorModal.js';
import useAlert from '@/composables/common/alert.js';
import useOrderData from '@/composables/checkout/useOrderData.js';
import { PAYMENT_TYPES } from '@/config/constants.js';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'Checkout',
	components: {
		IonPage,
		IonContent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonIcon,
		IonTitle,
		CheckoutItem,
		Payment,
		Button,
		IonFab,
		ErrorModal,
	},
	setup() {
		const router = useRouter();
		const { isOpen, onClose, errorData } = useErrorModal();
		const { showLoader, hideLoader, isLoading } = useLoader();
		const { showMessage } = useAlert();
		const { t } = useI18n();

		const {
			products,
			placeId,
			totalPrice,
			clearProducts,
			company,
			handleChangeCount,
			paymentType,
			paymentCard,
			handlePaymentTypeChange,
			orderBtnIsDisabled,
			editProductsAvailable,
			setPickupTime,
			pickupTime,
		} = useOrderData();

		const orderCreated = ref(false);
		const cards = ref([]);
		const currentOrderData = ref(null);

		const updateOrderPaymentTypeToCash = () => {
			return http.put(
				`/orders/${currentOrderData.value.id}/payment-type/update`
			);
		};

		const payWithSavedCard = async (orderId) => {
			const body = {
				orderId,
				rectoken: paymentCard.value,
			};

			return http
				.post(`/orders/pay`, body)
				.then(async () => {
					Haptics.impact(NotificationType.Success);
					showMessage({
						color: 'success',
						text: t('checkout.payment_success'),
						title: t('common.success'),
					});

					router.replace(`/success?type=card&time=${pickupTime.value}`);
				})
				.catch(() => {
					Haptics.impact(NotificationType.Error);
					showMessage({
						color: 'danger',
						text: t('common.something_wrong'),
					});
				});
		};

		const redirectToPayment = (data) => {
			router.replace(`/payment?orderId=${data.orderId}`);
		};

		const getUserSavedCards = () => {
			http.get('/users/mine/cards').then((res) => {
				cards.value = res.data.data
					.filter((card) => {
						const date = new Date(card.expiration);
						const now = new Date();

						return now < date;
					})
					.map((card) => {
						return {
							...card,
							cardType: card.cardType.toLowerCase(),
						};
					});
			});
		};

		const createOrder = (data) => {
			if (currentOrderData.value) {
				return Promise.resolve({
					data: { data: { order: currentOrderData.value } },
				});
			}

			return http.post('/orders/create', data);
		};

		const handleOrderClick = async () => {
			const data = {
				paymentMethod: paymentType.value,
				placeId: placeId.value,
				products: products.value.map((p) => {
					return {
						id: p.id,
						quantity: p.count,
					};
				}),
			};

			await showLoader();
			createOrder(data)
				.then(async (res) => {
					setPickupTime();
					editProductsAvailable.value = false;
					orderCreated.value = true;
					currentOrderData.value = res.data.data.order;

					if (paymentType.value === 'card') {
						if (paymentCard.value) {
							await payWithSavedCard(res.data.data.order.id);
							return;
						}

						redirectToPayment({
							orderId: res.data.data.order.id,
						});

						return;
					}

					if (
						currentOrderData.value &&
						currentOrderData.value.paymentMethod === PAYMENT_TYPES.CARD
					) {
						await updateOrderPaymentTypeToCash();
						Haptics.impact(NotificationType.Success);
						router.replace(`/success?type=cash&time=${pickupTime.value}`);

						return;
					}

					Haptics.impact(NotificationType.Success);
					router.replace(`/success?type=cash&time=${pickupTime.value}`);
				})
				.catch((err) => {
					Haptics.impact(NotificationType.Error);

					errorData.value = err.response.data.errors;
					isOpen.value = true;
				})
				.finally(() => {
					hideLoader();
				});
		};

		onIonViewWillEnter(() => {
			if (!products.value.length) {
				router.replace('/');
				return;
			}

			getUserSavedCards();
		});

		onIonViewDidLeave(() => {
			currentOrderData.value = null;
			editProductsAvailable.value = true;

			if (orderCreated.value) {
				clearProducts();
			}

			orderCreated.value = false;
		});

		const handlePaymentCardChange = (v) => {
			paymentCard.value = v;
		};

		const addNewCard = () => {
			paymentType.value = PAYMENT_TYPES.CARD;
			paymentCard.value = null;
			handleOrderClick();
		};

		return {
			chevronBackOutline,
			handleChangeCount,
			totalPrice,
			paymentType,
			handlePaymentTypeChange,
			orderBtnIsDisabled,
			handleOrderClick,
			products,
			company,
			isLoading,
			isOpen,
			onClose,
			errorData,
			cards,
			handlePaymentCardChange,
			editProductsAvailable,
			addNewCard,
			t,
		};
	},
};
</script>

<style lang="scss" scoped>
.back-btn {
	color: var(--white);
	--background: rgba(255, 255, 255, 0.2);
}

.right-notch {
	min-width: 40px;
}

.logo {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
	}
}

.content {
	padding-bottom: 10px !important;
	min-height: 100%;
}
</style>
