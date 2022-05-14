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
						{{ t('company.details') }}
					</ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<div
					class="is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
				>
					<div class="img">
						<img v-if="details.logo" alt="" :src="details.logo" />
					</div>

					<p class="fz-16 mb-5 fw-500 color-dark mt-2">
						{{ details.name }}
					</p>

					<div
						v-if="details.description"
						class="mt-5 fz-14 color-grey ion-text-justify bg-white p-3 br w-100 break-spaces"
					>
						<h3 class="title color-dark uppercase fz-14 fw-600 mb-2">
							{{ t('company.about') }}
						</h3>

						{{ details.description }}
					</div>

					<div
						v-if="details.instagram || details.facebook"
						class="mt-2 bg-white w-100 p-3 br"
					>
						<h3 class="title color-dark uppercase fz-14 fw-600 mb-2">
							{{ t('company.social') }}
						</h3>

						<company-social :details="details" :lines="false" />
					</div>

					<div
						v-if="details.Places"
						class="places mt-2 w-100 bg-white w-100 p-3 br"
					>
						<h3 class="title color-dark uppercase fz-14 fw-600 mb-2">
							{{ t('company.establishments') }}
						</h3>

						<div
							v-for="place in details.Places"
							:key="place.id"
							class="place"
							@click="openMaps(place)"
						>
							<span>
								<ion-icon :icon="locationOutline" class="mr-1" />
							</span>
							<span>
								{{ place.address }}
							</span>
						</div>
					</div>

					<products-section
						:loading="loadingProducts"
						:products="products"
						hide-company
						:title="t('company.latest')"
						class="w-100 mt-5"
					/>
				</div>
			</div>
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
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import Input from '@/components/common/Input.vue';
import ProductsSection from '@/components/common/ProductsSection.vue';
import Button from '@/components/common/Button.vue';
import CompanySocial from '@/components/product/CompanySocial.vue';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http';
import { useRoute } from 'vue-router';
import { ref } from '@vue/reactivity';
import { locationOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'Account',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		Input,
		Button,
		CompanySocial,
		ProductsSection,
	},
	setup() {
		const route = useRoute();
		const { showLoader, hideLoader } = useLoader();
		const details = ref({});
		const products = ref([]);
		const loadingProducts = ref(false);
		const { t } = useI18n();

		const getDetails = async () => {
			await showLoader();
			http
				.get(`/companies/${route.params.id}`)
				.then((res) => {
					details.value = res.data.data;
					hideLoader();
				})
				.catch((err) => {
					hideLoader();
				});
		};

		const openMaps = (place) => {
			open(
				`http://maps.google.com/?q=${place.location.coordinates[1]},${place.location.coordinates[0]}`
			);
		};

		const getCompanyProducts = () => {
			loadingProducts.value = true;

			http
				.get(
					`/products?companyId=${route.params.id}&status=active&orderBy=distance`
				)
				.then((res) => {
					products.value = res.data.data;
					loadingProducts.value = false;
				})
				.catch(() => {
					loadingProducts.value = false;
				});
		};

		onIonViewWillEnter(() => {
			getDetails();
			getCompanyProducts();
		});

		return {
			chevronBackOutline,
			details,
			locationOutline,
			openMaps,
			products,
			loadingProducts,
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

.br {
	border-radius: 5px;
}

.places {
	max-height: 70vh;
	overflow: auto;
}

.place {
	border-radius: 10px;
	background: var(--white);
	color: var(--ion-color-dark);
	margin-bottom: 5px;
	font-weight: 400;
	font-size: 14px;
	transition: all 0.2s;

	&:active {
		background: var(--ion-color-light-shade);
	}
}

.img {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	overflow: hidden;
	border: 3px solid var(--white);
	background: var(--ion-color-light);

	img {
		width: 100%;
	}
}
</style>
