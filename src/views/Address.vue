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
						{{ t('address.title') }}
					</ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div
				class="h-100 is-flex is-flex-direction-column ion-justify-content-between"
			>
				<div class="ion-padding">
					<template
						v-if="
							cachedGeolocation && !address && isLocationAllowed && !pageLoading
						"
					>
						<p class="fz-16 color-dark pb-2 ion-text-center fw-500 italic">
							{{ t('address.auto') }}
						</p>

						<p class="fz-14 color-grey mt-1 ion-text-center">
							{{ t('address.can') }}:
						</p>
					</template>
					<Input
						@update:modelValue="handleAddressInput"
						:placeholder="t('address.enter')"
						:label="t('address.title')"
						class="account-input"
						:model-value="addressSearch"
					/>

					<div class="mt-2 radios">
						<div v-if="loading" class="ion-text-center">
							<ion-spinner></ion-spinner>
						</div>

						<ion-radio-group
							mode="md"
							:value="selectedLocation"
							@ionChange="handleChangeLocation"
						>
							<ion-item
								v-for="location in results"
								:key="location.place_id"
								class="location-item"
								lines="none"
							>
								<ion-radio slot="start" :value="location.place_id"></ion-radio>

								<div class="p-2">
									{{ location.description }}
								</div>
							</ion-item>
							<ion-item key="auto" class="location-item" lines="none">
								<ion-radio slot="start" value="auto"></ion-radio>

								<div class="p-2">{{ t('address.auto_det') }}</div>
							</ion-item>
						</ion-radio-group>
					</div>
				</div>

				<div class="ion-padding">
					<Button
						color="primary"
						expand="full"
						shape="round"
						class="save"
						:disabled="!selectedLocation"
						@click="save"
					>
						{{ t('common.save') }}
					</Button>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script>
import { useStore } from 'vuex';
import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonButton,
	IonButtons,
	IonTitle,
	IonIcon,
	IonList,
	IonItem,
	IonRadio,
	IonRadioGroup,
	IonSpinner,
	IonFab,
	onIonViewWillEnter,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import Input from '@/components/common/Input.vue';
import { ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import debounce from '@/helpers/debounce.js';
import googleService from '@/services/google';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http/index.js';
import useAlert from '@/composables/common/alert.js';
import useGeolocation from '@/composables/common/geoLocation.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'Address',
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
		IonList,
		IonItem,
		IonRadio,
		IonRadioGroup,
		IonSpinner,
		IonFab,
	},
	setup() {
		const store = useStore();
		const { t } = useI18n();

		const userData = ref(null);
		const address = ref(null);
		const addressSearch = ref(null);
		const selectedLocation = ref(null);
		const results = ref([]);
		const loading = ref(false);
		const { showLoader, hideLoader, isLoading: pageLoading } = useLoader();
		const { showMessage } = useAlert();
		const {
			getCurrentLocation,
			cachedGeolocation,
			saveLocation,
			getNotAllowedValue,
		} = useGeolocation();

		const isLocationAllowed = ref(null);

		const fetchDetails = async () => {
			await showLoader();
			http
				.get('/users/mine')
				.then((res) => {
					const data = res.data.data;
					userData.value = data;

					address.value = data.address;
					addressSearch.value = data.address;

					if (!data.address && data.latitude) {
						selectedLocation.value = 'auto';
					}
				})
				.finally(() => {
					hideLoader();
				});
		};

		const displaySuggestions = debounce((v) => {
			if (!v) {
				loading.value = false;

				return;
			}

			googleService.autocomplete.getQueryPredictions(
				{ input: v, ComponentRestrictions: 'ua' },
				(locations) => {
					results.value = locations;
					loading.value = false;
				}
			);
		}, 1000);

		const handleAddressInput = (v) => {
			addressSearch.value = v;
			loading.value = true;
			displaySuggestions(v);
		};

		const updateAddress = async ({ latitude, longtitude }) => {
			const addressObj = results.value.find(
				(el) => el.place_id === selectedLocation.value
			);

			let addressName = null;

			if (selectedLocation.value !== 'auto') {
				addressName = addressObj?.description || address.value;
			}

			http
				.put('/users/update', {
					...userData.value,
					address: addressName,
					latitude,
					longtitude,
				})
				.then(async (res) => {
					store.dispatch('user/updateDetails', res.data.data);
					store.commit('nearest/clear');
					store.commit('user/changeShouldUpdateList', true);

					await saveLocation({
						latitude,
						longtitude,
					});

					results.value = [];
					address.value = addressName;
					addressSearch.value = addressName;

					if (!res.data.data.address) {
						selectedLocation.value = 'auto';
					} else {
						selectedLocation.value = null;
					}

					showMessage({
						color: 'success',
						text: t('account.updated'),
						title: t('common.success'),
					});
				})
				.catch(() => {
					showMessage({
						text: t('common.something_wrong'),
					});
				})
				.finally(() => {
					hideLoader();
				});
		};

		const save = async () => {
			await showLoader();
			if (selectedLocation.value === 'auto') {
				const location = await getCurrentLocation(true);

				if (!location) {
					showMessage({
						text: t('common.geo_denied'),
					});

					hideLoader();
					return;
				}

				updateAddress(location);
				return;
			}

			googleService.geocoder
				.geocode({
					placeId: selectedLocation.value,
				})
				.then(({ results }) => {
					const result = results[0];
					const lat = result.geometry.location.lat();
					const long = result.geometry.location.lng();

					updateAddress({
						latitude: lat,
						longtitude: long,
					});
				});
		};

		const handleChangeLocation = (e) => {
			selectedLocation.value = e.target.value;
		};

		onIonViewWillEnter(async () => {
			fetchDetails();
			const notAllowed = await getNotAllowedValue();

			isLocationAllowed.value = !notAllowed;
		});

		return {
			chevronBackOutline,
			address,
			save,
			handleAddressInput,
			results,
			selectedLocation,
			handleChangeLocation,
			loading,
			cachedGeolocation,
			addressSearch,
			isLocationAllowed,
			pageLoading,
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
	margin-top: 10px;
}

.location-item {
	--padding-start: 5px;
	--background: var(--white);
	border-bottom: 1px solid var(--ion-color-light);
}

.radios {
	border-radius: 30px;
	overflow: hidden;
}
</style>
