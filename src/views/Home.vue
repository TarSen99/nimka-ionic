<template>
	<ion-page v-bind="$attrs" class="ion-page">
		<!-- <Menu /> -->

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

					<SearchInput
						class="search-input-container"
						ref="searchInput"
						v-model="search"
						@update:modelValue="handleUpdateSearch"
					></SearchInput>

					<ion-buttons>
						<ion-button
							@click="settingsModalOpen = true"
							class="user-btn default-icon-btn"
							ref="settingsButton"
						>
							<ion-icon slot="icon-only" :icon="filterOutline"></ion-icon>
						</ion-button>
					</ion-buttons>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			@ionScroll="handleScroll($event)"
			forceOverscroll
		>
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

			<settings-modal
				:model-value="settingsModalOpen"
				@update:modelValue="handleCloseSettingns"
			/>

			<div ref="pageContent" class="h-100">
				<Filters
					:active-filter="orderBy"
					@update-order="handleUpdateOrderClick($event)"
					ref="topContent"
				/>

				<div class="ion-padding main-content relative" ref="mainContent">
					<div class="food-items pt-2">
						<location-access @update-list="updateList(1)" />
						<transition name="fade-slide">
							<active-order
								v-if="hasActiveOrderAsCustomer"
								key="order"
								class="mb-5"
							/>
						</transition>
						<product-categories
							v-show="!search"
							:update="updateCategories"
							@has="hasCategories = $event"
							@updated="updateCategories = false"
						/>

						<list-placeholder v-if="loading && !itemsList.length" />
						<div v-if="!itemsList.length && !loading">
							<p class="fz-14 ion-text-center fw-500 color-dark">
								{{ t('home.no_results') }}
							</p>
						</div>

						<h3
							v-if="itemsList && itemsList.length && hasCategories && !search"
							class="fz-16 color-dark fw-500 section-title mb-2 pt-2"
						>
							{{ t('home.all_proposals') }}
						</h3>
						<FoodItem
							v-for="product in itemsList"
							:data="product"
							:key="product"
							class="mb-3"
							@click="$router.push(`/product/${product.id}`)"
						/>

						<more-results
							v-if="search"
							class="pt-2 pb-2"
							@clear="handleClearSearch"
						/>

						<div v-if="showIncreaseMessage">
							<p class="ion-text-center color-grey italic fw-400 fz-14 mt-3">
								{{ t('home.try_to_increase') }}
								<br />
								{{ t('home.to_see') }}
							</p>

							<div class="ion-text-center fw-600">
								<Button
									class="radius-btn fz-14"
									@click="settingsModalOpen = true"
								>
									{{ t('home.increase') }}
								</Button>
							</div>
						</div>

						<nearest-products
							v-if="!itemsList.length && showNearest"
							class="mt-2"
						/>

						<div class="is-flex ion-justify-content-center pt-2 pb-2">
							<ion-spinner
								v-if="loading && itemsList.length"
								name="bubbles"
							></ion-spinner>
						</div>
					</div>
				</div>
			</div>

			<ion-infinite-scroll
				@ionInfinite="updateList(meta.page + 1, $event)"
				id="infinite-scroll"
				threshold="200px"
				:disabled="isDisabled"
			>
				<ion-infinite-scroll-content loading-spinner="bubbles">
				</ion-infinite-scroll-content>
			</ion-infinite-scroll>

			<transition name="fade-slide">
				<Checkout
					v-if="totalBoughtCount && showCheckout"
					:price="totalPrice"
					hide-overlay
				/>
			</transition>
		</ion-content>
	</ion-page>
</template>

<script>
import FoodItem from '@/components/home/FoodItem.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import Filters from '@/components/home/Filters.vue';
import useHeaderAnimation from '@/composables/home/useHeaderAnimation.js';
import ActiveOrder from '@/components/common/ActiveOrder.vue';
import ActiveIncomingOrders from '@/components/admin/ActiveIncomingOrders.vue';
import Button from '@/components/common/Button.vue';
import LocationAccess from '@/components/home/LocationAccess.vue';
import Checkout from '@/components/product/Checkout.vue';
import MoreResults from '@/components/home/MoreResults.vue';
import SettingsModal from '@/components/home/SettingsModal.vue';
import NearestProducts from '@/components/home/NearestProducts.vue';
import ProductCategories from '@/components/home/ProductCategories.vue';

import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonIcon,
	IonButton,
	IonButtons,
	IonRefresher,
	IonRefresherContent,
	onIonViewDidEnter,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonSpinner,
	onIonViewWillLeave,
} from '@ionic/vue';
import { computed, ref } from '@vue/reactivity';
import { personOutline, settingsOutline, filterOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import http from '@/services/http';
import { onMounted } from '@vue/runtime-core';
import ListPlaceholder from '@/components/common/ListPlaceholder.vue';
import useInfiniteList from '@/composables/common/infiniteList.js';
import usePushNotifications from '@/composables/common/pushNotifications.js';
import debounce from '@/helpers/debounce.js';
import useStoreProducts from '@/composables/product/useStoreProducts.js';
// import useUserData from '@/composables/common/initUserData.js';
import useGeolocation from '@/composables/common/geoLocation.js';
import { useI18n } from 'vue-i18n/index';

const getFilters = (filters) => {
	return `type=${filters.type.join(
		','
	)}&product_type=${filters.product_type.join(',')}&status=${filters.status
		.filter((v) => !!v)
		.join(',')}`;
};

export default {
	name: 'Home',
	components: {
		IonContent,
		IonHeader,
		IonPage,
		IonToolbar,
		FoodItem,
		IonButton,
		IonButtons,
		IonIcon,
		SearchInput,
		IonRefresher,
		IonRefresherContent,
		Filters,
		ActiveOrder,
		ActiveIncomingOrders,
		Button,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		IonSpinner,
		ListPlaceholder,
		LocationAccess,
		Checkout,
		MoreResults,
		SettingsModal,
		NearestProducts,
		ProductCategories,
	},
	setup() {
		const store = useStore();
		const { t } = useI18n();

		const {
			pageContent,
			header,
			handleScroll,
			accountButton,
			settingsButton,
			searchInput,
			topContent,
		} = useHeaderAnimation();
		const { cachedGeolocation, hasHardcodedAddress } = useGeolocation();
		const { totalBoughtCount, totalPrice } = useStoreProducts();
		// const { getCurrentLocationIfNeeded } = useUserData();
		const { addListeners, registerNotifications } = usePushNotifications();
		addListeners();

		const {
			meta,
			maxPage,
			loading,
			isDisabled,
			itemsList,
			orderBy,
			updateOrder,
			search,
			handleResponse,
		} = useInfiniteList();

		const mainContent = ref(null);
		const showCheckout = ref(false);
		const settingsModalOpen = ref(false);
		const showNearest = ref(false);
		const hasCategories = ref(false);
		const updateCategories = ref(false);

		const shouldUpdateList = computed(() => {
			return store.state.user.shouldUpdateList;
		});

		const menuisOpen = computed(() => store.state.menu.isOpen);
		const hasActiveOrderAsCustomer = computed(() => {
			return store.getters['myOrders/activeOrders'].length;
		});

		const filters = computed(() => {
			return store.state.user.filters;
		});

		const handleMenuClick = () => {
			store.commit('menu/handleMenu', !menuisOpen.value);
		};

		const updateList = async (page = 1, ev, doNotClearList) => {
			showNearest.value = false;
			loading.value = true;

			return http
				.get(
					`/products?page=${page}&orderBy=${orderBy.value}&search=${
						search.value
					}&${getFilters(filters.value)}`
				)
				.then((res) => {
					handleResponse(res, page, ev, doNotClearList);
					showNearest.value = true;
				});
		};

		const doRefresh = (e) => {
			updateCategories.value = true;
			updateList(1).finally(() => {
				e.target.complete();
			});
		};

		const handleUpdateSearch = debounce(() => {
			itemsList.value = [];

			updateList(1);
		}, 500);

		const handleClearSearch = () => {
			itemsList.value = [];
			search.value = null;

			updateList(1);
		};

		const handleUpdateOrderClick = (order) => {
			if (orderBy.value === order) {
				return;
			}

			itemsList.value = [];

			updateOrder(order);
			updateList(1);
		};

		onMounted(() => {
			registerNotifications();
			updateCategories.value = true;
		});

		onIonViewDidEnter(async () => {
			showCheckout.value = true;
			store.dispatch('myOrders/getMyOrders');

			if (shouldUpdateList.value) {
				updateList(1);
				updateCategories.value = true;
				store.commit('user/changeShouldUpdateList', false);
			} else {
				updateList(1, null, true);
			}
		});

		onIonViewWillLeave(() => {
			showCheckout.value = false;
		});

		const handleCloseSettingns = (data) => {
			settingsModalOpen.value = data.value;

			if (!data.changed && !data.filtersChanged) {
				return;
			}

			// Some delay to make sure radius is saved
			setTimeout(() => {
				if (data.changed) {
					updateCategories.value = true;
				}

				itemsList.value = [];
				updateList(1);
			}, 100);
		};

		const searchRadius = computed(() => {
			return store.state.user.profileSettings.searchRadius;
		});

		const showIncreaseMessage = computed(() => {
			// if (itemsList.value && itemsList.value.length) {
			// 	return false;
			// }

			if (loading.value) {
				return false;
			}

			if (search.value) {
				return false;
			}

			if (!searchRadius.value) {
				return false;
			}

			if (+searchRadius.value === 60) {
				return false;
			}

			if (
				(!cachedGeolocation.value ||
					!Object.keys(cachedGeolocation.value).length) &&
				!hasHardcodedAddress.value
			) {
				return false;
			}

			return true;
		});

		return {
			personOutline,
			doRefresh,
			updateOrder,
			pageContent,
			header,
			accountButton,
			handleScroll,
			searchInput,
			handleMenuClick,
			topContent,
			mainContent,
			hasActiveOrderAsCustomer,
			itemsList,
			isDisabled,
			updateList,
			loading,
			maxPage,
			meta,
			orderBy,
			handleUpdateOrderClick,
			search,
			handleUpdateSearch,
			totalPrice,
			showCheckout,
			totalBoughtCount,
			handleClearSearch,
			settingsOutline,
			settingsButton,
			settingsModalOpen,
			handleCloseSettingns,
			showNearest,
			showIncreaseMessage,
			hasCategories,
			updateCategories,
			filterOutline,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.header {
	&::after {
		display: none !important;
	}
}

.title {
	font-size: 16px;
	height: auto;
}

.placeholder {
	min-width: 30px;
	display: inline-block;
}

.user-btn {
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	color: #fff;
}

ion-content {
	--background: $gradientTopColor;
}

.ion-page {
	background-color: $gradientTopColor;
}

.search-input-container {
	width: 70%;
}

::v-deep(.refresher) {
	.refresher-refreshing {
		margin-top: 100px !important;
		--color: var(--white) !important;
		//  background-color: #f17e48 !important;
	}

	.refresher-refreshing-icon {
		color: var(--white) !important;
	}

	.refresher-pulling-icon {
		color: var(--white) !important;
	}
}

.main-content {
	min-height: 100%;
}

.food-items {
	padding-bottom: 35px;
}

.radius-btn {
	height: 30px;
}

.section-title {
	padding-left: 10px;
}
</style>
