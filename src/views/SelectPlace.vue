<template>
	<ion-page>
		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header" color="primary">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
				>
					<ion-buttons v-if="activePlace">
						<ion-button
							class="back-btn default-icon-btn"
							ref="backButton"
							@click.prevent="$router.back()"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<ion-title class="ion-text-center"> Select establishment </ion-title>

					<span v-if="activePlace" class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<Input
					v-model="search"
					placeholder="Search"
					class="w-100 search-input"
				/>

				<div class="places mt-2">
					<div
						v-for="place in filtered"
						:key="place.id"
						class="place"
						:class="{ selected: place.id === selected }"
						@click="selectPlace(place)"
					>
						{{ place.address }}
					</div>
				</div>

				<Button
					color="primary"
					expand="full"
					shape="round"
					class="save"
					:disabled="!selected"
					@click="submit"
				>
					Continue
				</Button>
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
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, onMounted } from '@vue/runtime-core';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import Input from '@/components/common/Input.vue';

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
		Button,
		Input,
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const selected = ref(null);
		const search = ref('');
		const { activePlace } = useCurrentPlace();

		const places = computed(() => {
			return store.state.company.places;
		});

		const selectPlace = (place) => {
			selected.value = place.id;
		};

		const filtered = computed(() => {
			return places.value.filter((p) => {
				const lowered = p.address.toLowerCase();
				return lowered.includes(search.value.toLowerCase());
			});
		});

		onMounted(() => {
			selected.value = activePlace.value;
		});

		const submit = () => {
			store.dispatch('user/updatePlace', selected.value);
			router.replace('/');
		};

		return {
			chevronBackOutline,
			places,
			selected,
			selectPlace,
			submit,
			activePlace,
			search,
			filtered,
		};
	},
};
</script>

<style lang="scss" scoped>
.placeholder {
	min-width: 30px;
	display: inline-block;
}

.save {
	margin-top: 50px;
}

.places {
	max-height: 70vh;
	min-height: 70vh;
	overflow: auto;
}

.place {
	padding: 10px;
	border-radius: 10px;
	background: var(--white);
	color: var(--ion-color-dark);
	margin-bottom: 5px;
	font-weight: 500;
	font-size: 14px;
	transition: all 0.2s;
}

.selected {
	background: var(--ion-color-light-shade);
}

::v-deep(.search-input) {
	.input-el {
		--background: var(--white);
	}
}
</style>
