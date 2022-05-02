<template>
	<ion-page v-bind="$attrs" class="ion-page">
		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
				>
					<ion-buttons>
						<ion-button
							@click="handleMenuClick"
							class="user-btn default-icon-btn"
							ref="accountButton"
						>
							<ion-icon slot="icon-only" :icon="personOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<div class="logo">
						<img src="@/assets/icons/niamka_color.svg" alt="" />
					</div>

					<div class="placeholder"></div>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" :scroll-events="true" forceOverscroll>
			<ion-refresher
				slot="fixed"
				@ionRefresh="update($event)"
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

			<view-product-modal
				:is-open="showProductModal"
				:currentProductDetails="currentProductDetails"
				@close="handleProductModalClose($event)"
			/>

			<div class="ion-padding">
				<h1 class="fz-22 color-dark m-0 fw-600">Dashboard</h1>

				<div class="mt-5 pt-3">
					<div class="is-flex ion-justify-content-between">
						<h2 class="fz-18 color-dark m-0 fw-500">Last orders</h2>

						<span class="view-all" @click="$router.push('/incoming-orders')">
							View all
						</span>
					</div>
					<status-filter
						:model-value="orderStatus"
						:options="ORDER_STATUSES"
						class="mt-2"
						@update:modelValue="updateOrderStatus"
					/>

					<raw-placeholder v-if="loadingOrders" class="mt-2" />

					<swiper
						v-else
						:slides-per-view="1.2"
						:space-between="8"
						ref="ordersEl"
						class="mt-3"
					>
						<swiper-slide v-for="order in lastOrders" :key="order.id">
							<OrderItem
								class="mb-3 place-order-item"
								:data="order"
								hide-company
								@click="openOrderModal(order)"
							>
								<template #top>
									<div>
										<p class="fw-400 color-dark fz-14">
											Order <span class="fw-500">#{{ order.orderNumber }}</span>
										</p>
									</div>
								</template>
							</OrderItem>
						</swiper-slide>
					</swiper>

					<div v-if="!lastOrders.length && !loadingOrders" class="mt-2">
						<p class="fw-500 color-dark fz-14 ion-text-center">List is empty</p>
					</div>
				</div>

				<div class="mt-5 pt-3">
					<div class="is-flex ion-justify-content-between">
						<h2 class="fz-18 color-dark m-0 fw-500">Last products</h2>

						<span class="view-all" @click="$router.push('/my-products')">
							View all
						</span>
					</div>
					<status-filter
						:model-value="productStatus"
						:options="PRODUCT_STATUSES"
						class="mt-2"
						@update:modelValue="updateProductStatus"
					/>

					<raw-placeholder v-if="loadingProducts" class="mt-2" />

					<swiper
						v-else
						ref="productsEl"
						:slides-per-view="1.2"
						:space-between="8"
						class="mt-3"
					>
						<swiper-slide
							v-for="product in lastProducts"
							:key="product.id"
							class="product-slide"
						>
							<FoodItem
								:data="product"
								class="mb-3"
								admin-view
								@click="handleProductClick(product)"
							>
								<div class="product-status">
									<product-status-badge :status="product.status" />
								</div>
							</FoodItem>
						</swiper-slide>
					</swiper>

					<div v-if="!lastProducts.length && !loadingProducts" class="mt-2">
						<p class="fw-500 color-dark fz-14 ion-text-center">List is empty</p>
					</div>
				</div>

				<div class="mt-5 pt-5">
					<Button
						expand="full"
						shape="round"
						class="new-product-btn w-100"
						@click="$router.push(`/new-product`)"
					>
						Add new product
					</Button>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script>
import SearchInput from '@/components/common/SearchInput.vue';
import Filters from '@/components/home/Filters.vue';
import Button from '@/components/common/Button.vue';
import RawPlaceholder from '@/components/common/RawPlaceholder.vue';
import StatusFilter from '@/components/common/StatusFilter.vue';
import { personOutline } from 'ionicons/icons';

import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonIcon,
	IonButton,
	IonButtons,
	IonSpinner,
	onIonViewWillEnter,
	IonRefresher,
	IonRefresherContent,
} from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import FoodItem from '@/components/home/FoodItem.vue';
import ProductStatusBadge from '@/components/admin/ProductStatusBadge.vue';
import OrderItem from '@/components/orders/OrderItem.vue';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal.vue';
import ViewProductModal from '@/components/admin/ViewProductModal.vue';

import { computed, onMounted, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import http from '@/services/http';
import { ORDER_STATUSES, PRODUCT_STATUSES } from '@/config/constants.js';
import usePushNotifications from '@/composables/common/pushNotifications.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';

const getOrderStatuses = () => {
	const CURR_ORDER_STATUSES = {
		...ORDER_STATUSES,
	};

	// delete CURR_ORDER_STATUSES.ACTIVE;

	return CURR_ORDER_STATUSES;
};

export default {
	name: 'Home',
	components: {
		IonContent,
		IonHeader,
		IonPage,
		IonToolbar,
		IonButton,
		IonButtons,
		IonIcon,
		SearchInput,
		Filters,
		Button,
		IonSpinner,
		RawPlaceholder,
		Swiper,
		SwiperSlide,
		FoodItem,
		ProductStatusBadge,
		OrderItem,
		OrderDetailsModal,
		ViewProductModal,
		StatusFilter,
		IonRefresher,
		IonRefresherContent,
	},
	setup() {
		const { addListeners, registerNotifications } = usePushNotifications();
		const route = useRoute();
		const store = useStore();
		const menuisOpen = computed(() => store.state.menu.isOpen);
		const loadingProducts = ref(false);
		const loadingOrders = ref(false);
		const productsEl = ref(null);
		const ordersEl = ref(null);
		const { activePlace } = useCurrentPlace();

		addListeners();

		const showOrderDetails = ref(false);
		const activeOrder = ref({});
		const showProductModal = ref(false);
		const currentProductDetails = ref({});

		const lastProducts = ref([]);

		const lastOrders = computed(() => {
			return store.state.placeOrders.orders;
		});

		// const orderStatus = ref(['to_take', 'payed']);

		const orderStatus = computed(() => {
			return store.state.placeOrders.status;
		});

		const productStatus = computed(() => {
			return store.state.lastProducts.status;
		});

		const handleMenuClick = () => {
			store.commit('menu/handleMenu', !menuisOpen.value);
		};

		const getPlaceProducts = () => {
			loadingProducts.value = true;

			return http
				.get(
					`/places/${
						activePlace.value
					}/products?status=${productStatus.value.join(',')}`
				)
				.then((res) => {
					// productsEl.value.$el.swiper.slideTo(0);

					lastProducts.value = res.data.data;
					loadingProducts.value = false;
				})
				.catch(() => {
					loadingProducts.value = false;
				});
		};

		const getPlaceOrders = () => {
			loadingOrders.value = true;
			return store
				.dispatch('placeOrders/getPlaceOrders', {
					placeId: activePlace.value,
				})
				.then((res) => {
					loadingOrders.value = false;
				})
				.catch(() => {
					loadingOrders.value = false;
				});
		};

		const openOrderModal = (order) => {
			activeOrder.value = order;
			showOrderDetails.value = true;
		};

		const changeOrderStatus = (details, status) => {
			const order = lastOrders.value.find((el) => el.id === details.id);

			if (!order) {
				return;
			}

			order.status = status;
		};

		const handleProductModalClose = (newStatus) => {
			showProductModal.value = false;

			if (newStatus) {
				currentProductDetails.value.status = newStatus;
			}

			currentProductDetails.value = {};
		};

		const handleProductClick = (product) => {
			currentProductDetails.value = product;
			showProductModal.value = true;
		};

		const update = (e) => {
			Promise.all([getPlaceProducts(), getPlaceOrders()]).then(() => {
				if (e) {
					e.target.complete();
				}
			});
		};

		const updateOrderStatus = (v) => {
			store.commit('placeOrders/setStatus', v);
			getPlaceOrders();
		};

		const updateProductStatus = (v) => {
			store.commit('lastProducts/setStatus', v);
			getPlaceProducts();
		};

		onIonViewWillEnter(() => {
			update();
		});

		onMounted(() => {
			registerNotifications();
		});

		return {
			lastProducts,
			loadingProducts,
			lastOrders,
			loadingOrders,
			showOrderDetails,
			activeOrder,
			showProductModal,
			currentProductDetails,
			ORDER_STATUSES: getOrderStatuses(),
			PRODUCT_STATUSES,
			productStatus,
			orderStatus,
			productsEl,
			ordersEl,

			updateOrderStatus,
			handleMenuClick,
			openOrderModal,
			changeOrderStatus,
			handleProductModalClose,
			handleProductClick,
			getPlaceProducts,
			getPlaceOrders,
			update,
			updateProductStatus,

			personOutline,
		};
	},
};
</script>

<style scoped lang="scss">
.view-all {
	color: var(--ion-color-primary);
	font-size: 14px;
	font-weight: 500;
}

.product-slide {
	// min-width: 320px;
}

.header {
	background: var(--white);

	&::after {
		display: none !important;
	}
}

.new-product-btn {
	--background: linear-gradient(
		180deg,
		#f17e48 0.39%,
		#ec5230 70.34%
	) !important;
	height: 45px;
}

.user-btn {
	background: var(--dark-grey);
	border-radius: 50%;
	color: #fff;
}

.product-status {
	position: absolute;
	z-index: 2;
	bottom: 10px;
	left: 10px;
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

.logo {
	width: 50px;
	height: 50px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		min-width: 60px;
		min-height: 60px;
	}
}

.placeholder {
	min-width: 40px;
}
</style>
