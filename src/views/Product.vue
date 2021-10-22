<template>
	<ion-page class="ion-page">
		<ion-header mode="md" class="header">
			<ion-toolbar mode="md" class="toolbar">
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

					<Badge color="danger" class="p-1 take-time" ref="tag">
						<span class="fz-14">
							Take 18:00 - 20:00
						</span>
					</Badge>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			@ionScroll="handleScroll($event)"
		>
			<div class="top"></div>

			<div
				class="main-content pt-5 relative is-flex is-flex-direction-column ion-justify-content-between"
				ref="container"
			>
				<div class="ion-padding">
					<h1 class="fz-24 dark">
						Tasty burger
					</h1>

					<p class="fz-14 dark mt-3">
						This burger includes meet and someother stuff. Doesn’t metter...
					</p>

					<div class="btn-container mt-5 pt-5 relative">
						<transition name="fade">
							<div
								v-if="boughtCount"
								class="is-flex ion-justify-content-end absolute action-btns ion-align-items-center w-100"
							>
								<Button
									shape="round"
									@click="addProduct(-1)"
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
									@click="addProduct(1)"
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
								@click="handleBuy()"
							>
								Order 50hrn
							</Button>
						</div>
					</div>
				</div>

				<div>
					<div class="ion-padding-start ion-padding-end">
						<div class="map relative">
							<GoogleMap
								api-key=""
								style="width: 100%; height: 100%"
								:center="center"
								:zoom="15"
								disable-default-ui
							>
								<Marker :options="{ position: center }" />
							</GoogleMap>

							<div
								class="overlay absolute w-100 h-100 is-flex ion-justify-content-center ion-align-items-center"
							>
								<p class="overlay-text fw-500">
									Tap here to move the map
								</p>
							</div>
						</div>
					</div>
					<div class="ion-padding bottom-section">
						<CompanyInfo />
					</div>

					<h2 class="ion-padding-start mt-5 pt-5 fz-18">
						Other products from this company
					</h2>
					<FoodSlider class="mt-2" />
				</div>
			</div>

			<transition name="fade-slide">
				<Checkout v-if="boughtCount" :count="boughtCount" />
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

import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import useProductHeaderAnimation from '@/composables/product/useProductHeaderAnimation.js';
import { GoogleMap, Marker } from 'vue3-google-map';
import CompanyInfo from '@/components/product/CompanyInfo.vue';
import FoodSlider from '@/components/product/FoodSlider.vue';
import Checkout from '@/components/product/Checkout.vue';
import { ref } from '@vue/reactivity';

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
		GoogleMap,
		Marker,
		CompanyInfo,
		FoodSlider,
		Checkout,
	},
	setup() {
		const {
			header,
			backButton,
			container,
			tag,
			handleScroll,
		} = useProductHeaderAnimation();

		const center = { lat: 40.689247, lng: -74.044502 };
		const boughtCount = ref(0);

		const handleBuy = () => {
			boughtCount.value++;
		};

		const addProduct = (v) => {
			boughtCount.value += v;
		};

		return {
			center,
			header,
			backButton,
			handleScroll,
			chevronBackOutline,
			tag,
			container,
			boughtCount,
			handleBuy,
			addProduct,
		};
	},
};
</script>

<style scoped lang="scss">
.top {
	min-height: 220px;
	background-image: url('./../assets/images/product.png');
	background-size: cover; /* Resize the background image to cover the entire container */
	background-position: center; /* Center the image */
	background-repeat: no-repeat; /* Do not repeat the image */
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

.back-btn {
	color: var(--white);
	--background: rgba(255, 255, 255, 0.2);
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
}

.overlay-text {
	color: var(--white);
}

.bottom-section {
	// background-color: var(--ion-color-primary);
}

.main-content {
	min-height: calc(100vh - 220px);
	// overflow: hidden;
}

.action-btn {
	font-weight: 500;
	font-size: 20px;
	--padding-top: 0;
	--padding-bottom: 0;
	--padding-end: 0;
	--padding-start: 0;
	min-width: 25px;
	height: 25px;

	// &:first-child {
	// 	margin-left: 5px;
	// }
}

.action-btns {
	top: 5px;
	left: 0;
	transform: translateY(-50%);
}
</style>
