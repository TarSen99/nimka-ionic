<template>
	<ion-page class="ion-page">
		<ion-header mode="md" class="header">
			<ion-toolbar ref="header" mode="md" class="toolbar">
				<div
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

					<Badge color="danger" class="p-1 take-time" ref="tag">
						<span class="fz-14"> Take {{ fromTime }} - {{ toTime }} </span>
					</Badge>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			@ionScroll="handleScroll($event)"
		>
			<div class="top">
				<swiper
					ref="slider"
					:pagination="true"
					:modules="modules"
					class="swiper-el"
				>
					<swiper-slide v-for="image in images" :key="image.id">
						<img :src="image.url" class="top-img" alt="" />
					</swiper-slide>
				</swiper>
			</div>

			<div
				class="main-content pt-5 relative is-flex is-flex-direction-column"
				ref="container"
			>
				<div class="ion-padding">
					<div>
						<Badge color="dark" class="p-1">
							<span class="fz-14 px-3 color-light">
								{{ details.availableCount }} left
							</span>
						</Badge>
					</div>

					<h1 class="fz-22 color-dark">{{ details.title }}</h1>

					<p
						ref="descriptionEl"
						class="fz-16 dark mt-3 view-description"
						:class="{ viewAll }"
					>
						{{ details.description }}
					</p>
					<a
						v-if="showViewAll"
						href="#"
						@click.prevent="handleViewAll"
						class="fz-14"
					>
						{{ viewAll ? 'Hide' : 'View all' }}
					</a>

					<div class="btn-container mt-5 pt-5 relative">
						<transition name="fade">
							<div
								v-if="boughtCount"
								class="is-flex ion-justify-content-end absolute action-btns ion-align-items-center w-100"
							>
								<Button
									shape="round"
									@click="removeProduct(details)"
									color="danger"
									class="action-btn"
								>
									-
								</Button>

								<span class="ml-2 mr-2 fw-500">
									{{ boughtCount }}
								</span>

								<Button
									shape="round"
									@click="addProduct(details)"
									color="success"
									class="action-btn"
								>
									+
								</Button>
							</div>
						</transition>

						<div>
							<Button
								expand="full"
								shape="round"
								class="order-btn w-100"
								@click="addProduct(details)"
							>
								Order {{ details.priceWithDiscount }} UAH
							</Button>
						</div>
					</div>
				</div>

				<div>
					<div class="ion-padding-start ion-padding-end">
						<div class="map w-100 h-100 relative">
							<div id="map" class="w-100 h-100" ref="map"></div>

							<div
								v-if="showMapOverlay"
								@click="showMapOverlay = false"
								class="overlay absolute w-100 h-100 is-flex ion-justify-content-center ion-align-items-center"
							>
								<p class="overlay-text fw-500">Tap here to move the map</p>
							</div>
						</div>
					</div>
					<div class="ion-padding bottom-section">
						<CompanyInfo :details="details.Company" />
					</div>

					<div v-if="placeProducts.length">
						<h2 class="ion-padding-start mt-5 pt-5 fz-18">
							Other products from {{ details.Company && details.Company.name }}
						</h2>
						<FoodSlider class="mt-2" :products="placeProducts" />
					</div>
					<div v-else class="placeholder"></div>
				</div>
			</div>

			<transition name="fade-slide">
				<Checkout v-if="boughtCount" :price="totalPrice" />
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
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { onIonViewWillEnter } from '@ionic/vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';

import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import useProductHeaderAnimation from '@/composables/product/useProductHeaderAnimation.js';
import CompanyInfo from '@/components/product/CompanyInfo.vue';
import FoodSlider from '@/components/product/FoodSlider.vue';
import Checkout from '@/components/product/Checkout.vue';
import { ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import http from '@/services/http';
import { computed } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import useDescriptionCutter from '@/composables/common/useDescriptionCutter.js';
import google from '@/services/google';

export default {
	name: 'Product',
	components: {
		Button,
		IonContent,
		IonPage,
		IonHeader,
		IonToolbar,
		IonButtons,
		Badge,
		IonIcon,
		IonButton,
		CompanyInfo,
		FoodSlider,
		Checkout,
		Swiper,
		SwiperSlide,
	},
	setup() {
		const { header, backButton, container, tag, handleScroll } =
			useProductHeaderAnimation();
		const route = useRoute();
		const store = useStore();
		const showMapOverlay = ref(true);
		const map = ref(null);
		const details = ref({});
		const placeProducts = ref([]);
		const isLoading = ref(false);
		const modules = [Pagination];

		const { descriptionEl, showViewAll, handleViewAll, viewAll } =
			useDescriptionCutter({
				isLoading,
			});

		const images = computed(() => {
			let result = details.value.Images || [{}];

			return result;
		});

		const fromTime = computed(() => {
			return DateTime.fromISO(details.value.takeTimeFrom).toFormat('HH:mm');
		});

		const toTime = computed(() => {
			return DateTime.fromISO(details.value.takeTimeTo).toFormat('HH:mm');
		});

		const storeProducts = computed(() => {
			return store.state.products.products;
		});

		const addProduct = (product) => {
			if (!storeProducts.value.length) {
				store.commit('products/addProduct', product);
				return;
			}

			const place = product.PlaceId;
			const fromStorePlace = storeProducts.value[0].PlaceId;

			if (place !== fromStorePlace) {
				store.commit('products/clear');
			}

			store.commit('products/addProduct', product);
		};

		const removeProduct = (product) => {
			store.commit('products/removeProduct', product);
		};

		const boughtCount = computed(() => {
			const saved = store.state.products.products;

			const currProduct = saved.find((p) => p.id === details.value.id);

			if (!currProduct) {
				return 0;
			}

			return currProduct.count;
		});

		const totalPrice = computed(() => {
			return store.getters['products/totalPrice'];
		});

		const updateDetails = () => {
			isLoading.value = true;
			return http
				.get(`/products/${route.params.id}`)
				.then((res) => {
					details.value = res.data.data;
				})
				.finally(() => {
					isLoading.value = false;
				});
		};

		const getPlaceProducts = () => {
			return http
				.get(`/places/${details.value.Place.id}/products`)
				.then((res) => {
					placeProducts.value = res.data.data.filter(
						(p) => p.id !== +route.params.id
					);
				});
		};

		onIonViewWillEnter(() => {
			updateDetails().then(() => {
				getPlaceProducts();
				const place = details.value.Place;

				const position = { lat: +place.latitude, lng: +place.longtitude };

				google.onInit(() => {
					const googleMap = new window.google.maps.Map(map.value, {
						center: position,
						zoom: 14,
						disableDefaultUI: true,
					});

					const marker = new window.google.maps.Marker({
						position: position,
						map: googleMap,
					});
				});
			});
		});

		return {
			header,
			backButton,
			handleScroll,
			chevronBackOutline,
			tag,
			container,
			boughtCount,
			addProduct,
			removeProduct,
			totalPrice,
			showMapOverlay,
			details,
			images,
			fromTime,
			toTime,
			map,
			placeProducts,
			descriptionEl,
			showViewAll,
			handleViewAll,
			viewAll,
			modules,
		};
	},
};
</script>

<style scoped lang="scss">
.top {
	min-height: 250px;
	height: 250px;
	overflow: hidden;
}

.top-img {
	width: 100%;
	height: auto;
}

.order-btn {
	--background: linear-gradient(
		180deg,
		#f17e48 0.39%,
		#ec5230 70.34%
	) !important;
	height: 45px;
}

.header {
	position: fixed;
	overflow: initial;
}

.header-content {
	height: 56px;
}

.toolbar {
	box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 2%);
}

.map {
	border-radius: 30px;
	overflow: hidden;
	width: 100%;
	height: 200px;
}

.overlay {
	background-color: rgba(0, 0, 0, 0.4);
	top: 0;
	left: 0;
	border-radius: 30px;
}

.overlay-text {
	color: var(--white);
}

.main-content {
	min-height: calc(100vh - 220px);
	position: relative;
	z-index: 2;
}

::v-deep(.map) {
	.gm-style {
		border-radius: 30px !important;
		overflow: hidden !important;
	}
}

::v-deep(.swiper-el) {
	.swiper-pagination {
		bottom: initial;
		top: 190px;

		.swiper-pagination-bullet {
			background-color: var(--white);
			opacity: 0.8;
			width: 10px;
			height: 10px;
			transition: all 0.2s ease;
		}
		.swiper-pagination-bullet-active {
			background-color: var(--ion-color-primary);
			opacity: 1;
			width: 11px;
			height: 11px;
		}
	}
}
</style>
