<template>
	<ion-page>
		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header" color="primary">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
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

					<ion-title class="ion-text-center"> My orders </ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<OrderItem
					v-for="item in orders"
					:key="item.key"
					class="mb-3"
					:data="item"
					@click="openModal(item)"
				/>
			</div>
		</ion-content>
		<active-order-modal
			:is-open="isModalOpened"
			@close="onHideModal"
			:selected-order="selectedOrder"
		/>
	</ion-page>
</template>

<script>
import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonButton,
	IonButtons,
	IonTitle,
	IonIcon,
	onIonViewWillEnter,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import OrderItem from '@/components/orders/OrderItem.vue';
import { useStore } from 'vuex';
import { computed, ref } from '@vue/runtime-core';
import ActiveOrderModal from '@/components/common/ActiveOrderModal.vue';
import useLoader from '@/composables/common/useLoader.js';

export default {
	name: 'Orders',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		OrderItem,
		ActiveOrderModal,
	},
	setup() {
		const store = useStore();
		const isModalOpened = ref(false);
		const selectedOrder = ref(null);
		const { showLoader, hideLoader } = useLoader();

		onIonViewWillEnter(() => {
			showLoader();
			store.dispatch('myOrders/getMyOrders').finally(() => {
				hideLoader();
			});
		});

		const orders = computed(() => {
			return store.state.myOrders.orders;
		});

		const openModal = (data) => {
			selectedOrder.value = data;
			isModalOpened.value = true;
		};

		const onHideModal = () => {
			selectedOrder.value = null;
			isModalOpened.value = false;
		};

		return {
			orders,
			chevronBackOutline,
			isModalOpened,
			openModal,
			onHideModal,
			selectedOrder,
		};
	},
};
</script>

<style lang="scss" scoped>
.placeholder {
	min-width: 30px;
	display: inline-block;
}

::v-deep(.account-input) {
	.input-el {
		--background: var(--white);
	}

	.label {
		color: var(--dark-grey);
		font-size: 14px !important;
	}
}

.save {
	margin-top: 50px;
}
</style>
