<template>
	<ion-page
		class="ion-page"
		:class="{
			outOfStock:
				details.status === PRODUCT_STATUSES.OUT_OF_STOCK ||
				details.status === PRODUCT_STATUSES.EXPIRED,
		}"
	>
		<transition name="slide-y">
			<ion-header v-show="viewCurrentImageIsHidden" mode="md" class="header">
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
								<ion-icon
									slot="icon-only"
									:icon="chevronBackOutline"
								></ion-icon>
							</ion-button>
						</ion-buttons>

						<Badge
							v-show="details.status === PRODUCT_STATUSES.OUT_OF_STOCK"
							color="danger"
							class="p-1 out-of-stock"
						>
							<span class="fz-16 px-5"> Out of stock</span>
						</Badge>

						<Badge
							v-show="details.status === PRODUCT_STATUSES.EXPIRED"
							color="primary"
							class="p-1 out-of-stock"
						>
							<span class="fz-16 px-5"> You missed it</span>
						</Badge>

						<Badge
							v-show="details.status === PRODUCT_STATUSES.ACTIVE"
							color="danger"
							class="p-1 take-time"
							ref="tag"
						>
							<span class="fz-14"> Take {{ fromTime }} - {{ toTime }} </span>
						</Badge>
					</div>
				</ion-toolbar>
			</ion-header>
		</transition>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			:scroll-y="allowScroll"
			@ionScroll="handleScroll($event)"
			no-bounce
			has-bouncing="false"
			forceOverscroll="false"
		>
			<view-image-modal
				v-model="viewCurrentImage"
				@update:modelValue="handleAllowScroll"
				:images="images"
				:activeImageIndex="activeImageIndex"
				@hide-started="viewCurrentImageIsHidden = true"
			/>

			<div class="top">
				<swiper
					ref="swiper"
					:pagination="true"
					:modules="modules"
					class="swiper-el"
				>
					<swiper-slide
						v-for="(image, index) in images"
						:key="image.id"
						@click="handleImageClick(image, index)"
					>
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
						<div class="is-flex ion-justify-content-between">
							<div class="fz-14 distance no-wrap">
								<template v-if="distance">
									<ion-icon
										:icon="navigateOutline"
										class="vertical-middle mr-1"
									></ion-icon>

									<span class="vertical-middle fz-14 fw-600">
										{{ distance }} km
									</span>
								</template>
							</div>

							<div>
								<Badge
									v-if="details.status === PRODUCT_STATUSES.ACTIVE"
									color="dark"
									class="p-1"
								>
									<span class="fz-14 px-3 color-light">
										{{ details.availableCount }} left
									</span>
								</Badge>
							</div>
						</div>

						<div
							class="is-flex ion-justify-content-end ion-align-items-end mt-1"
						>
							<span class="fz-14 line-through color-grey mr-2 mb-1"
								>{{
									details.fullPrice && details.fullPrice.toFixed(2)
								}}
								UAH</span
							>
							<span class="fw-600 fz-22 color-dark">
								{{
									details.priceWithDiscount &&
									details.priceWithDiscount.toFixed(2)
								}}
								UAH
							</span>
						</div>
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

					<div
						v-if="userRole === ROLES.CUSTOMER"
						class="btn-container mt-5 pt-5 relative"
					>
						<transition name="fade">
							<div
								v-if="currProductBoughtCount"
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
									{{ currProductBoughtCount }}
								</span>

								<Button
									shape="round"
									:disabled="addButtonDisabled"
									color="success"
									class="action-btn"
									@click="addProduct(details)"
								>
									+
								</Button>
							</div>
						</transition>

						<div v-if="details.status === PRODUCT_STATUSES.ACTIVE">
							<Button
								expand="full"
								shape="round"
								class="order-btn w-100"
								:disabled="
									details.status !== PRODUCT_STATUSES.ACTIVE ||
									addButtonDisabled
								"
								@click="addProduct(details)"
							>
								Add to cart
							</Button>
						</div>
					</div>

					<div v-else>
						<Button
							expand="full"
							shape="round"
							class="order-btn w-100"
							@click="$router.push(`/new-product/${details.id}`)"
						>
							Edit
						</Button>
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
				<Checkout v-if="totalBoughtCount" :price="totalPrice" />
			</transition>
		</ion-content>
	</ion-page>
</template>

<script>
import { chevronBackOutline, navigateOutline } from 'ionicons/icons';
import { onIonViewWillEnter } from '@ionic/vue';
import { distanceToKm } from '@/helpers';
import useProductHeaderAnimation from '@/composables/product/useProductHeaderAnimation.js';
import { ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import http from '@/services/http';
import { computed } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import useDescriptionCutter from '@/composables/common/useDescriptionCutter.js';
import google from '@/services/google';
import { ROLES } from '@/config/constants.js';

import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
} from '@ionic/vue';
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import CompanyInfo from '@/components/product/CompanyInfo.vue';
import FoodSlider from '@/components/product/FoodSlider.vue';
import Checkout from '@/components/product/Checkout.vue';
import ViewImageModal from '@/components/common/ViewImageModal.vue';

import { PRODUCT_STATUSES } from '@/config/constants.js';
import { checkIfProductBuyAvailable } from '@/helpers';
import useDialog from '@/composables/common/dialog.js';
import useLoader from '@/composables/common/useLoader.js';
import usePlaceholder from '@/composables/common/usePlaceholder.js';
import useStoreProducts from '@/composables/product/useStoreProducts.js';

const MAX_MINUTES_DIFFERENCE = 5;

const compareTime = (a, b) => {
	const aTime = DateTime.fromISO(a);
	const bTime = DateTime.fromISO(b);

	const diff = aTime.diff(bTime, 'minutes').toObject();

	const abs = Math.abs(diff.minutes);

	if (abs > MAX_MINUTES_DIFFERENCE) {
		return false;
	}

	return true;
};

const compareProductsTime = (storeProducts, productToAdd) => {
	for (const product of storeProducts) {
		const isTimeFromOk = compareTime(
			product.takeTimeFrom,
			productToAdd.takeTimeFrom
		);

		if (!isTimeFromOk) {
			return false;
		}

		const isTimeToOk = compareTime(product.takeTimeTo, productToAdd.takeTimeTo);

		if (!isTimeToOk) {
			return false;
		}
	}

	return true;
};

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
		ViewImageModal,
	},
	setup() {
		const { header, backButton, container, tag, handleScroll } =
			useProductHeaderAnimation();
		const swiper = ref(null);

		const { confirm } = useDialog();
		const route = useRoute();
		const store = useStore();
		const showMapOverlay = ref(true);
		const map = ref(null);
		const viewCurrentImage = ref(null);
		const viewCurrentImageIsHidden = ref(true);
		const activeImageIndex = ref(0);
		const allowScroll = ref(true);
		const details = ref({});
		const placeProducts = ref([]);
		const modules = [Pagination];
		const { showLoader, hideLoader, isLoading } = useLoader();
		const { getImages } = usePlaceholder();
		const { totalBoughtCount, totalPrice } = useStoreProducts();

		const { descriptionEl, showViewAll, handleViewAll, viewAll } =
			useDescriptionCutter({
				isLoading,
			});

		const userRole = computed(() => {
			return store.state.user.role;
		});

		const images = computed(() => {
			return getImages(details.value.Images);
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

		const addProduct = async (product) => {
			if (!storeProducts.value.length) {
				store.commit('products/addProduct', product);
				return;
			}

			const place = product.PlaceId;
			const fromStorePlace = storeProducts.value[0].PlaceId;

			if (place !== fromStorePlace) {
				const confirmValue = await confirm({
					message:
						'You already added products from different store. Do you want to clear cart and continue?',
				});

				if (!confirmValue) {
					return;
				}

				store.commit('products/clear');
			}

			const timeCheck = compareProductsTime(storeProducts.value, product);

			if (!timeCheck) {
				const confirmValue = await confirm({
					message:
						'You can not add products with pick up time more then 5min. difference to one order. Do you want to clear cart and continue?',
				});

				if (!confirmValue) {
					return;
				}

				store.commit('products/clear');
			}

			store.commit('products/addProduct', product);
		};

		const removeProduct = (product) => {
			store.commit('products/removeProduct', product);
		};

		const currProductBoughtCount = computed(() => {
			const saved = store.state.products.products;

			const currProduct = saved.find((p) => p.id === details.value.id);

			if (!currProduct) {
				return 0;
			}

			return currProduct.count;
		});

		const updateDetails = async () => {
			await showLoader();
			return http
				.get(`/products/${route.params.id}`)
				.then((res) => {
					details.value = res.data.data;
				})
				.finally(() => {
					hideLoader();
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

		const distance = computed(() => {
			return distanceToKm(details.value.distance);
		});

		const addButtonDisabled = computed(() => {
			return checkIfProductBuyAvailable(
				details.value,
				currProductBoughtCount.value
			);
		});

		onIonViewWillEnter(() => {
			updateDetails().then(() => {
				getPlaceProducts();
				const place = details.value.Place;
				const [longtitude, latitude] = place.location.coordinates;

				const position = { lat: +latitude, lng: +longtitude };

				google.onInit(() => {
					const googleMap = new window.google.maps.Map(map.value, {
						center: position,
						zoom: 14,
						disableDefaultUI: true,
					});

					new window.google.maps.Marker({
						position: position,
						map: googleMap,
					});
				});
			});
		});

		const handleImageClick = (image, index) => {
			allowScroll.value = false;
			activeImageIndex.value = index;
			viewCurrentImage.value = image.url;
			viewCurrentImageIsHidden.value = false;
		};

		const handleAllowScroll = () => {
			allowScroll.value = true;
		};

		return {
			distance,
			header,
			backButton,
			handleScroll,
			chevronBackOutline,
			tag,
			container,
			currProductBoughtCount,
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
			navigateOutline,
			PRODUCT_STATUSES,
			addButtonDisabled,
			totalBoughtCount,
			viewCurrentImage,
			viewCurrentImageIsHidden,
			activeImageIndex,
			handleImageClick,
			allowScroll,
			handleAllowScroll,
			swiper,
			ROLES,
			userRole,
		};
	},
};
</script>

<style scoped lang="scss">
.outOfStock {
	.top {
		filter: grayscale(1);
	}
}

.back-btn {
	--background: rgba(0, 0, 0, 0.05);
}

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
	// box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 2%);
	box-shadow: none;
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
		display: flex;
		justify-content: center;
		align-items: center;

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

.view-description {
	white-space: pre-line;
}
</style>
