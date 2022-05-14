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

					<ion-title class="ion-text-center">
						{{ t('incoming_orders.title') }}
					</ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<ion-refresher
				slot="fixed"
				@ionRefresh="doRefresh($event)"
				:pullMin="120"
				:pullMax="200"
				pull-factor="0.5"
			>
				<ion-refresher-content
					class="refresher"
					refreshing-spinner="crescent"
				></ion-refresher-content>
			</ion-refresher>

			<order-details-modal
				:is-open="showOrderDetails"
				:details="activeOrder"
				@close="showOrderDetails = false"
				@change-status="changeOrderStatus(activeOrder, $event)"
			/>

			<div class="ion-padding">
				<status-filter
					:model-value="orderStatus"
					:options="ORDER_STATUSES"
					class="mt-2 mb-5"
					translationKey="order_status"
					@update:modelValue="updateOrderStatus"
				/>

				<list-placeholder v-if="loading && !itemsList.length" />
				<div v-if="!itemsList.length && !loading">
					<p class="fz-14 ion-text-center fw-500 color-dark">
						{{ t('dashboard.no_orders') }}
					</p>
				</div>

				<template v-if="itemsList.length">
					<OrderItem
						v-for="item in itemsList"
						:key="item.key"
						class="mb-3 place-order-item"
						:data="item"
						hide-company
						@click="openModal(item)"
					>
						<template #top>
							<div>
								<p class="fw-400 color-dark fz-14">
									{{ t('common.order') }}
									<span class="fw-500">#{{ item.orderNumber }}</span>
								</p>
							</div>
						</template>
					</OrderItem>
				</template>

				<div class="is-flex ion-justify-content-center pt-2 pb-2">
					<ion-spinner
						v-if="loading && itemsList.length"
						name="bubbles"
					></ion-spinner>
				</div>
			</div>

			<ion-infinite-scroll
				@ionInfinite="updateList(meta.page + 1, $event)"
				threshold="200px"
				:disabled="isDisabled"
			>
				<ion-infinite-scroll-content loading-spinner="bubbles">
				</ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</ion-content>
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
	IonRefresher,
	IonRefresherContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonSpinner,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { ref, computed } from '@vue/reactivity';
import FoodItem from '@/components/home/FoodItem.vue';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal.vue';
import useInfiniteList from '@/composables/common/infiniteList.js';
import http from '@/services/http';
import ListPlaceholder from '@/components/common/ListPlaceholder.vue';
import { useStore } from 'vuex';
import OrderItem from '@/components/orders/OrderItem.vue';
import { ORDER_STATUSES } from '@/config/constants.js';
import StatusFilter from '@/components/common/StatusFilter.vue';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'Incoming Orders',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		FoodItem,
		OrderDetailsModal,
		IonRefresher,
		IonRefresherContent,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		IonSpinner,
		ListPlaceholder,
		OrderItem,
		StatusFilter,
	},
	setup() {
		const store = useStore();
		const showOrderDetails = ref(false);
		const activeOrder = ref({});
		const { activePlace } = useCurrentPlace();
		const { t } = useI18n();

		const {
			meta,
			maxPage,
			loading,
			isDisabled,
			itemsList,
			orderBy,
			search,
			handleResponse,
		} = useInfiniteList();

		const orderStatus = computed(() => {
			return store.state.placeOrders.status;
		});

		const updateList = async (page = 1, ev, doNotClearList) => {
			loading.value = true;
			return http
				.get(
					`/places/${activePlace.value}/orders?page=${page}&orderBy=${
						orderBy.value
					}&search=${search.value}&status=${orderStatus.value.join(',')}`
				)
				.then((res) => {
					handleResponse(res, page, ev, doNotClearList);
				})
				.catch(() => {
					loading.value = false;
				});
		};

		const doRefresh = (e) => {
			updateList(1, null, true).finally(() => {
				e.target.complete();
			});
		};

		onIonViewWillEnter(() => {
			updateList(1);
		});

		const openModal = (order) => {
			activeOrder.value = order;
			showOrderDetails.value = true;
		};

		const changeOrderStatus = (details, status) => {
			const order = itemsList.value.find((el) => el.id === details.id);

			if (!order) {
				return;
			}

			order.status = status;
		};

		const updateOrderStatus = (v) => {
			store.commit('placeOrders/setStatus', v);

			itemsList.value = [];
			updateList(1);
		};

		return {
			loading,
			chevronBackOutline,
			showOrderDetails,
			doRefresh,
			isDisabled,
			itemsList,
			orderBy,
			meta,
			maxPage,
			updateList,
			openModal,
			activeOrder,
			changeOrderStatus,
			orderStatus,
			updateOrderStatus,
			ORDER_STATUSES,
			t,
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

::v-deep(.place-order-item) {
	.location-details {
		-webkit-line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
</style>
