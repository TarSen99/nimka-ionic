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
						Address
					</ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<Input
					@update:modelValue="handleAddressInput"
					placeholder="Enter address here"
					label="Address"
					class="account-input"
					:model-value="address"
				/>

				<div class="mt-5">
					<p v-if="!loading && !results.length" class="ion-text-center fz-14 pl-5 pr-5">
						Enter your address and select correct one from results
					</p>

					<div v-if="loading" class="ion-text-center">
						<ion-spinner></ion-spinner>
					</div>

					<ion-radio-group mode="md" :value="selectedLocation">
						<ion-item
							v-for="location in results"
							:key="location.place_id"
							class="location-item"
							lines="none"
						>
							<ion-radio
								slot="start"
								:value="location.place_id"
								@click="handleChangeLocation"
							></ion-radio>

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
					@click="save"
					class="save"
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
	toastController,
	IonSpinner,
	IonFab,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import Input from '@/components/common/Input.vue';
import { ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import { inject, onMounted } from 'vue';
import debounce from '@/helpers/debounce.js';

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
		const axios = inject('axios');
		const address = ref(null);
		const selectedLocation = ref(null);
		const results = ref([]);
		const loading = ref(false);
		let googleService;
		let geocoder;

		onMounted(() => {
			const script = document.createElement('script');
			script.onload = function() {
				googleService = new window.google.maps.places.AutocompleteService();
				geocoder = new window.google.maps.Geocoder();
			};
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_API_KEY}&libraries=places`;
			document.getElementsByTagName('head')[0].appendChild(script);
		});
		// axios
		// 	.get(
		// 		`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=test&key=${process.env.VUE_APP_GOOGLE_API_KEY}`
		// 	)
		// 	.then((response) => {
		// 		console.log(JSON.stringify(response.data));
		// 	});

		const displaySuggestions = debounce((v) => {
			googleService.getQueryPredictions(
				{ input: v, ComponentRestrictions: 'ua' },
				(locations) => {
					results.value = locations;
					loading.value = false;
				}
			);
		}, 1000);

		const handleAddressInput = (v) => {
			address.value = v;
			displaySuggestions(v);
			loading.value = true;
		};

		const save = () => {
			geocoder
				.geocode({
					placeId: selectedLocation.value,
				})
				.then(({ results }) => {
					const result = results[0];
					const lat = result.geometry.location.lat();
					const long = result.geometry.location.lng();

					const toast = toastController.create({
						header: 'Saved successfully',
						message: `lat: ${lat} long: ${long}`,
						position: 'top',
						color: 'success',
						duration: 1000,
					});

					return toast;
				})
				.then((toast) => {
					toast.present();
				});
		};

		const handleChangeLocation = (e) => {
			selectedLocation.value = e.target.value;
		};

		return {
			chevronBackOutline,
			address,
			save,
			handleAddressInput,
			results,
			selectedLocation,
			handleChangeLocation,
			loading,
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
