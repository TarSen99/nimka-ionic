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

					<ion-title class="ion-text-center"> Checkout </ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding">
			<div class="content">
				<div class="is-flex ion-align-items-center mb-2">
					<div class="logo mr-2">
						<img :src="company.logo" alt="" />
					</div>
					<h2 class="mt-2 mb-2 color-dark fz-18">
						Order from {{ company.name }}
					</h2>
				</div>
				<CheckoutItem
					v-for="(item, index) in products"
					:key="index"
					:product="item"
					:total-products-count="products.length"
					@change-count="handleChangeCount($event, item)"
					class="mb-2"
				></CheckoutItem>

				<h2 class="ion-text-end fz-20 mt-3">Total: {{ totalPrice }} UAH</h2>

				<Payment
					class="mt-5 pt-5"
					@payment-type="handlePaymentTypeChange"
					@update-details="handleDetailsChange"
				/>
			</div>

			<ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
				<div class="order-container ion-padding w-100">
					<Button
						color="primary"
						expand="block"
						class="order"
						@click="handleOrderClick"
						:disabled="orderBtnIsDisabled || isLoading"
					>
						Order {{ totalPrice }} UAH
					</Button>
				</div>
			</ion-fab>
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
	IonFab,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import CheckoutItem from '@/components/checkout/CheckoutItem.vue';
import Payment from '@/components/checkout/Payment.vue';
import { computed, ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';

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
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const { showLoader, hideLoader, isLoading } = useLoader();

		const items = ref([]);
		const paymentType = ref(null);
		const cardDetails = ref({});

		const products = computed(() => {
			return store.state.products.products;
		});

		const placeId = computed(() => {
			return products.value[0]?.PlaceId;
		});

		const totalPrice = computed(() => {
			return store.getters['products/totalPrice'];
		});

		const clearProducts = () => {
			store.commit('products/clear');
		};

		const addProduct = (product) => {
			store.commit('products/addProduct', product);
		};

		const removeProduct = (product) => {
			store.commit('products/removeProduct', product);
		};

		const company = computed(() => {
			const product = products.value[0];

			return product?.Company || {};
		});

		const handleChangeCount = (type, product) => {
			if (type === 1) {
				addProduct(product);
				return;
			}

			removeProduct(product);
		};

		const handlePaymentTypeChange = (v) => {
			paymentType.value = v;
		};

		const handleDetailsChange = (v) => {
			cardDetails.value = v;
		};

		const orderBtnIsDisabled = computed(() => {
			if (!totalPrice.value) {
				return true;
			}

			if (!paymentType.value) {
				return true;
			}

			if (paymentType.value === 'card' && !cardDetails.value.valid) {
				return true;
			}

			return false;
		});

		const handleOrderClick = () => {
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

			showLoader();
			http
				.post('/orders/create', data)
				.then(() => {
					clearProducts();
					if (paymentType.value === 'card') {
						router.push('/success?type=credit');
						return;
					}

					router.push('/success?type=cash');
				})
				.finally(() => {
					hideLoader();
				});
		};

		return {
			chevronBackOutline,
			handleChangeCount,
			totalPrice,
			items,
			paymentType,
			handlePaymentTypeChange,
			handleDetailsChange,
			cardDetails,
			orderBtnIsDisabled,
			handleOrderClick,
			products,
			company,
			isLoading,
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
