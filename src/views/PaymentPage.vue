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
							@click.prevent="$router.replace('/orders')"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<ion-title class="ion-text-center">
						{{ t('checkout.payment') }}
					</ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			class="ion-padding"
			:class="{ paymentSuccess }"
		>
			<div class="content" id="payment"></div>
			<transition name="slide-bottom">
				<Button
					v-if="paymentSuccess"
					@click="$router.replace('/')"
					class="w-100"
				>
					{{ t('checkout.home') }}
				</Button>
			</transition>
		</ion-content>
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
	onIonViewWillEnter,
	onIonViewWillLeave,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import ErrorModal from '@/components/checkout/ErrorModal.vue';
import paymentSercive from '@/services/payment';
import Button from '@/components/common/Button.vue';
import { ref } from '@vue/reactivity';
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
		ErrorModal,
		Button,
	},
	setup() {
		const route = useRoute();
		const { showLoader, hideLoader } = useLoader();
		const paymentSuccess = ref(null);
		const app = ref(null);
		const { t } = useI18n();

		const getPaymentToken = () => {
			const orderId = route.query.orderId;

			if (!orderId) {
				return Promise.reject();
			}

			return http.get(`/orders/checkout/${orderId}`).then((res) => {
				return res.data.data.token;
			});
		};

		onIonViewWillLeave(() => {
			if (!app.value) {
				return;
			}

			app.value.$destroy();
			app.value.$el.remove();
		});

		onIonViewWillEnter(async () => {
			showLoader();

			let token;

			try {
				token = await getPaymentToken();
			} catch (e) {
				return;
			}

			paymentSercive.onInit(() => {
				const Options = {
					options: {
						methods: ['card'],
						methods_disabled: [],
						card_icons: ['mastercard', 'visa'],
						title: 'Оплата',
						full_screen: false,
						email: false,
						active_tab: 'card',
					},
					params: {
						token,
					},
				};

				app.value = paymentSercive
					.fondy('#payment', Options)
					.$on('ready', (model) => {
						const order_status = model.attr('order.order_data.order_status');

						if (order_status == 'approved') {
							paymentSuccess.value = true;
						}
					})
					.$on('success', function (model) {
						const order_status = model.attr('order.order_data.order_status');

						if (order_status == 'approved') {
							Haptics.impact(NotificationType.Success);
							paymentSuccess.value = true;
						}
					});

				setTimeout(() => {
					hideLoader();
				}, 300);
			});
		});

		return {
			chevronBackOutline,
			paymentSuccess,
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
	padding-bottom: 100px !important;
}
</style>

<style lang="scss">
#payment {
	display: flex;
	min-height: 90vh;
	height: 90vh;
	padding: 0 !important;
	align-items: center;

	.f-checkout-email {
		outline: none !important;
		border-radius: 30px !important;
		box-shadow: none !important;
		border: none !important;
	}

	& > div {
		max-height: 100%;
		margin: auto;
		width: 100%;
	}

	.f-header {
		display: none !important;
	}

	.f-container {
		background: var(--ion-background-color) !important;
		--fondy-container_bg: var(--ion-background-color) !important;
	}

	.f-page-card {
		background: var(--ion-background-color) !important;
	}

	.f-order-desc-text {
		background: transparent !important;
	}

	.f-button-pay {
		border-radius: 30px;
		border-radius: 30px !important;
		font-weight: 500 !important;

		&::before {
			display: none !important;
		}

		&::after {
			background: var(--ion-color-primary) !important;
			border-radius: 30px !important;
		}
	}

	.f-card-bg {
		background: var(--ion-color-dark) !important;
	}

	.f-card-shadow {
		display: none !important;
	}

	.f-amount,
	.f-currency {
		color: var(--ion-color-dark) !important;
	}

	.f-container-sm {
		max-width: 90vw !important;
	}

	.f-scrollbar-wrap {
		padding: 0 !important;
	}

	.f-icons-title {
		color: var(--color-color-grey);
	}

	.f-price {
		display: none !important;
	}

	.f-merchant-name {
		color: var(--ion-color-dark) !important;
		font-size: 22px !important;
		font-weight: 600 !important;
	}

	.f-top {
		display: none !important;
	}

	.f-sidebar {
		background: transparent !important;
		border: none !important;
	}
}

.paymentSuccess {
	#payment {
		align-items: flex-start !important;
		max-height: 430px !important;
		min-height: 430px !important;

		& > div {
			min-height: 430px !important;
			max-height: 430px !important;
			margin: 0 !important;
		}
	}
}

.f-page-success {
	background: var(--ion-background-color) !important;
}

.ipsp-modal-wrapper {
	display: flex !important;
	align-items: center !important;
}

.ipsp-modal-close {
	top: var(--ion-safe-area-top) !important;
}
</style>
