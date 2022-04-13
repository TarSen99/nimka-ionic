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
					></SearchInput>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			@ionScroll="handleScroll($event)"
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

			<div ref="pageContent" class="h-100">
				<Filters
					:active-filter="orderBy"
					@update-order="handleUpdateOrderClick($event)"
					ref="topContent"
				/>

				<div class="ion-padding main-content relative" ref="mainContent">
					<div class="food-items pt-2">
						<transition name="fade-slide">
							<active-order
								v-if="hasActiveOrderAsCustomer && !isPartner"
								key="order"
								class="mb-5"
							/>
						</transition>
						<list-placeholder v-if="loading && !itemsList.length" />
						<!-- <transition name="fade-slide">
							<active-incoming-orders
								v-if="hasActiveIncomingOrder && isPartner"
								key="order-2"
								class="mb-5"
								@complete-order="hasActiveIncomingOrder = false"
							/>
						</transition> -->
						<FoodItem
							v-for="product in itemsList"
							:data="product"
							:key="product"
							class="mb-3"
							@click="$router.push(`/product/${product.id}`)"
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
} from '@ionic/vue';
import { computed, ref } from '@vue/reactivity';
import { personOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import http from '@/services/http';
import { onMounted } from '@vue/runtime-core';
import { ROLES } from '@/config/constants.js';
import ListPlaceholder from '@/components/common/ListPlaceholder.vue';
import useInfiniteList from '@/composables/common/infiniteList.js';

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
	},
	setup() {
		const {
			pageContent,
			header,
			handleScroll,
			accountButton,
			searchInput,
			topContent,
		} = useHeaderAnimation();

		const store = useStore();
		const mainContent = ref(null);
		const hasActiveIncomingOrder = ref(false);

		const {
			meta,
			maxPage,
			loading,
			isDisabled,
			itemsList,
			orderBy,
			updateOrder,
		} = useInfiniteList();

		const menuisOpen = computed(() => store.state.menu.isOpen);

		const handleMenuClick = () => {
			store.commit('menu/handleMenu', !menuisOpen.value);
		};

		const hasActiveOrderAsCustomer = computed(() => {
			return store.getters['myOrders/activeOrders'].length;
		});

		const isPartner = computed(() => {
			const role = store.state.user.role;

			return (
				role === ROLES.EMPLOYEE ||
				role === ROLES.MANAGER ||
				role === ROLES.OWNER
			);
		});

		const updateList = (page = 1, ev) => {
			loading.value = true;

			return http
				.get(`/products?page=${page}&orderBy=${orderBy.value}`)
				.then((res) => {
					if (page === 1) {
						itemsList.value = res.data.data;
					} else {
						itemsList.value = [...itemsList.value, ...res.data.data];
					}
					meta.value = res.data.meta;
					loading.value = false;

					if (ev) {
						ev.target.complete();
					}
				});
		};

		const doRefresh = (e) => {
			updateList().finally(() => {
				e.target.complete();
			});
		};

		const handleUpdateOrderClick = (order) => {
			if (orderBy.value === order) {
				return;
			}

			updateOrder(order);
			updateList(1);
		};

		onMounted(() => {
			updateList();
		});

		onIonViewDidEnter(() => {
			store.dispatch('myOrders/getMyOrders');
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
			hasActiveIncomingOrder,
			isPartner,
			itemsList,
			isDisabled,
			updateList,
			loading,
			maxPage,
			meta,
			orderBy,
			handleUpdateOrderClick,
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
	// --background: rgba(255, 255, 255, 0.2);
	// --color: var(--white);
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
}

.main-content {
	min-height: 100%;
}
</style>
