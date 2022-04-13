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

					<ion-title class="ion-text-center"> Address </ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<template v-if="cachedGeolocation && !address">
					<p class="fz-16 color-dark pb-2 ion-text-center fw-500 italic">
						Your location is autodetected
					</p>

					<p class="fz-14 color-grey mt-1 ion-text-center">
						You can also select your address from list:
					</p>
				</template>
				<Input
					@update:modelValue="handleAddressInput"
					placeholder="Enter address here"
					label="Address"
					class="account-input"
					:model-value="addressSearch"
				/>

				<div class="mt-1">
					<p
						v-if="!loading && !results.length"
						class="ion-text-center fz-14 pl-5 pr-5 mb-1"
					>
						Enter your address and select correct one from results
					</p>

					<div v-if="loading" class="ion-text-center">
						<ion-spinner></ion-spinner>
					</div>

					<ion-radio-group
						mode="md"
						:value="selectedLocation"
						@ionChange="handleChangeLocation"
					>
						<ion-item key="auto" class="location-item" lines="none">
							<ion-radio slot="start" value="auto"></ion-radio>

							<div class="p-2">Autodetection</div>
						</ion-item>

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
					</ion-radio-group>
				</div>
			</div>

			<ion-fab
				vertical="bottom"
				horizontal="left"
				slot="fixed"
				class="w-100 ion-padding"
			>
				<Button
					color="primary"
					expand="full"
					shape="round"
					class="save"
					:disabled="!selectedLocation"
					@click="save"
				>
					Save
				</Button>
			</ion-fab>
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
		const userData = ref(null);
		const address = ref(null);
		const addressSearch = ref(null);
		const selectedLocation = ref(null);
		const results = ref([]);
		const loading = ref(false);
		const { showLoader, hideLoader } = useLoader();
		const { showMessage } = useAlert();
		const { getCurrentLocation, cachedGeolocation } = useGeolocation();

		const fetchDetails = () => {
			showLoader();
			http
				.get('/users/mine')
				.then((res) => {
					const data = res.data.data;
					userData.value = data;

					address.value = data.address;
					addressSearch.value = data.address;
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

		const updateAddress = ({ latitude, longtitude }) => {
			const addressObj = results.value.find(
				(el) => el.place_id === selectedLocation.value
			);

			let addressName = null;

			if (addressObj) {
				addressName = addressObj.description;
			}

			http
				.put('/users/update', {
					...userData.value,
					address: addressName,
					latitude,
					longtitude,
				})
				.then(() => {
					results.value = [];
					address.value = addressName;
					addressSearch.value = addressName;
					showMessage({
						color: 'success',
						text: `Details were successfully updated`,
						title: 'Success',
					});
				})
				.catch(() => {
					showMessage({
						text: `Something went wrong. Please try again`,
					});
				})
				.finally(() => {
					hideLoader();
				});
		};

		const save = async () => {
			showLoader();

			if (selectedLocation.value === 'auto') {
				const location = await getCurrentLocation();

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

		onIonViewWillEnter(() => {
			fetchDetails();
			getCurrentLocation();
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
</style>
