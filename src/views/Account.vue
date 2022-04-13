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

					<ion-title class="ion-text-center"> Account </ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<Input
					v-model="name"
					placeholder="Name"
					label="Name"
					class="account-input"
				/>
				<Input
					v-model="mobile"
					placeholder="Mobile"
					label="Mobile"
					class="account-input"
					disabled
				/>

				<Button
					color="primary"
					expand="full"
					shape="round"
					class="save"
					:disabled="!name"
					@click="save"
				>
					Save
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
	onIonViewWillEnter,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import Input from '@/components/common/Input.vue';
import { ref } from '@vue/reactivity';
import Button from '@/components/common/Button.vue';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http/index.js';
import useAlert from '@/composables/common/alert.js';

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
	},
	setup() {
		const name = ref(null);
		const mobile = ref(null);
		const { showLoader, hideLoader } = useLoader();
		const { showMessage } = useAlert();

		const save = () => {
			showLoader();

			http
				.put('/users/update', {
					name: name.value,
				})
				.then(() => {
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

		const fetchDetails = () => {
			showLoader();
			http
				.get('/users/mine')
				.then((res) => {
					const data = res.data.data;

					name.value = data.name;
					mobile.value = data.phone;
				})
				.finally(() => {
					hideLoader();
				});
		};

		onIonViewWillEnter(() => {
			fetchDetails();
		});

		return {
			chevronBackOutline,
			name,
			mobile,
			save,
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
</style>
