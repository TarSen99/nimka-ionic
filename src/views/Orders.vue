<template>
	<ion-page>
		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header" color="primary">
				<div
					class="is-flex is-flex-direction-column ion-align-items-center ion-justify-content-between px-4"
				>
					<div
						class="is-flex ion-align-items-center ion-justify-content-between w-100"
					>
						<ion-buttons>
							<ion-button
								class="back-btn default-icon-btn"
								ref="backButton"
								@click.prevent="goBack"
							>
								<ion-icon
									slot="icon-only"
									:icon="chevronBackOutline"
								></ion-icon>
							</ion-button>
						</ion-buttons>

						<ion-title class="ion-text-center"> My orders </ion-title>

						<span class="placeholder"></span>
					</div>

					<ion-segment
						:value="filter"
						@ionChange="filter = $event.target.value"
					>
						<ion-segment-button value="active">
							<ion-label>Active</ion-label>
						</ion-segment-button>
						<ion-segment-button value="all">
							<ion-label>All</ion-label>
						</ion-segment-button>
					</ion-segment>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<template v-if="currentOrders.length">
					<OrderItem
						v-for="item in currentOrders"
						:key="item.key"
						class="mb-3"
						:data="item"
						@click="openModal(item)"
					>
						<template #top>
							<div>
								<p class="fw-400 color-dark fz-14">
									Order <span class="fw-500">#{{ item.orderNumber }}</span>
								</p>
							</div>
						</template>
					</OrderItem>
				</template>
				<p v-else class="ion-text-center fw-500 color-dark">List is empty</p>
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
	IonSegment,
	IonSegmentButton,
	IonLabel,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import OrderItem from '@/components/orders/OrderItem.vue';
import { useStore } from 'vuex';
import { computed, ref } from '@vue/runtime-core';
import ActiveOrderModal from '@/components/common/ActiveOrderModal.vue';
import useLoader from '@/composables/common/useLoader.js';
import { useRouter } from 'vue-router';

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
		IonSegment,
		IonSegmentButton,
		IonLabel,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const isModalOpened = ref(false);
		const selectedOrder = ref(null);
		const filter = ref('active');
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

		const activeOrders = computed(() => {
			return store.getters['myOrders/activeOrders'];
		});

		const currentOrders = computed(() => {
			if (filter.value === 'active') {
				return activeOrders.value || [];
			}

			return orders.value || [];
		});

		const openModal = (data) => {
			selectedOrder.value = data;
			isModalOpened.value = true;
		};

		const onHideModal = () => {
			selectedOrder.value = null;
			isModalOpened.value = false;
		};

		const goBack = () => {
			if (window.history.state.back === '/home') {
				router.back();
				return;
			}

			router.push('/');
		};

		return {
			orders,
			chevronBackOutline,
			isModalOpened,
			openModal,
			onHideModal,
			selectedOrder,
			goBack,
			filter,
			currentOrders,
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
