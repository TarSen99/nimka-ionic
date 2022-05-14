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
						{{ t('my_products.title') }}
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

			<view-product-modal
				:is-open="showProductModal"
				:currentProductDetails="currentProductDetails"
				@close="handleClose($event)"
			/>

			<div class="ion-padding">
				<status-filter
					:model-value="productStatus"
					:options="PRODUCT_STATUSES"
					class="mt-2 mb-5"
					@update:modelValue="updateProductStatus"
					translationKey="product_status"
				/>

				<list-placeholder v-if="loading && !itemsList.length" />
				<div v-if="!itemsList.length && !loading">
					<p class="fz-14 ion-text-center fw-500 color-dark">
						{{ t('dashboard.no_pr') }}
					</p>
				</div>
				<FoodItem
					v-for="product in itemsList"
					:data="product"
					:key="product"
					class="mb-3"
					admin-view
					@click="handleProductClick(product)"
				>
					<div class="product-status">
						<product-status-badge :status="product.status" />
					</div>
				</FoodItem>

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
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import ProductItem from '@/components/admin/ProductItem.vue';
import ViewProductModal from '@/components/admin/ViewProductModal.vue';
import http from '@/services/http';
import { computed } from '@vue/runtime-core';
import ListPlaceholder from '@/components/common/ListPlaceholder.vue';
import useInfiniteList from '@/composables/common/infiniteList.js';
import FoodItem from '@/components/home/FoodItem.vue';
import ProductStatusBadge from '@/components/admin/ProductStatusBadge.vue';
import StatusFilter from '@/components/common/StatusFilter.vue';
import { PRODUCT_STATUSES } from '@/config/constants.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'My products',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		ViewProductModal,
		ProductItem,
		ListPlaceholder,
		IonRefresher,
		IonRefresherContent,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		IonSpinner,
		FoodItem,
		ProductStatusBadge,
		StatusFilter,
	},
	setup() {
		const store = useStore();
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
		const { activePlace } = useCurrentPlace();
		const { t } = useI18n();

		const productStatus = computed(() => {
			return store.state.lastProducts.status;
		});

		const updateList = async (page = 1, ev, doNotClearList) => {
			loading.value = true;
			return http
				.get(
					`/places/${activePlace.value}/products?page=${page}&orderBy=${
						orderBy.value
					}&search=${search.value}&status=${productStatus.value.join(',')}`
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

		const showProductModal = ref(false);
		const currentProductDetails = ref({});

		const handleProductClick = (product) => {
			currentProductDetails.value = product;
			showProductModal.value = true;
		};

		const handleClose = (newStatus) => {
			showProductModal.value = false;

			if (newStatus) {
				currentProductDetails.value.status = newStatus;
			}

			currentProductDetails.value = {};
		};

		const updateProductStatus = (v) => {
			store.commit('lastProducts/setStatus', v);
			itemsList.value = [];

			updateList(1);
		};

		return {
			chevronBackOutline,
			showProductModal,
			loading,
			doRefresh,
			isDisabled,
			itemsList,
			orderBy,
			updateOrder,
			search,
			meta,
			maxPage,
			updateList,
			handleProductClick,
			currentProductDetails,
			handleClose,
			updateProductStatus,
			productStatus,
			PRODUCT_STATUSES,
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

.product-status {
	position: absolute;
	z-index: 2;
	bottom: 10px;
	left: 10px;
}
</style>
