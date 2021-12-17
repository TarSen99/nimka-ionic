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
						Checkout
					</ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding">
			<div class="content">
				<h2 class="mt-2 mb-2">
					Order from Best company
				</h2>
				<CheckoutItem
					v-for="(item, index) in items"
					:key="index"
					:product="item"
					@change-count="handleChangeCount($event, index)"
					class="mb-2"
				></CheckoutItem>

				<h2 class="ion-text-end fz-20 mt-3">Total: {{ totalPrice }}hrn.</h2>

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
						:disabled="orderBtnIsDisabled"
					>
						Order {{ totalPrice }}hrn.
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
import { useRouter } from 'vue-router'

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
		const router = useRouter()
		const items = ref(DEFAULT_ITEMS);
		const paymentType = ref(null);
		const cardDetails = ref({});

		const totalPrice = computed(() => {
			return items.value.reduce((prev, curr) => {
				return curr.count * curr.price + prev;
			}, 0);
		});

		const handleChangeCount = (value, index) => {
			const product = items.value[index];
			const newV = product.count + value;

			if (newV < 0) {
				return;
			}

			items.value[index].count = newV;
		};

		const handlePaymentTypeChange = (v) => {
			paymentType.value = v.value;
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

			if (paymentType.value === 'credit' && !cardDetails.value.valid) {
				return true;
			}

			return false;
		});

		const handleOrderClick = () => {
			if(paymentType.value === 'credit') {
				router.push('/success?type=credit')
				return
			}

			router.push('/success?type=cash')
		}

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
			handleOrderClick
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

.order-container {
	//	padding-top: 50px;
}

.content {
	padding-bottom: 100px !important;
}
</style>
