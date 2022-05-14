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
						{{ t('change_pass.title') }}
					</ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<div class="ion-padding">
				<Input
					v-model="password"
					:placeholder="t('change_pass.curr')"
					:label="t('change_pass.curr')"
					class="account-input"
					type="password"
					:error="passwordError"
				/>

				<Input
					v-model="newPassword"
					:placeholder="t('change_pass.new')"
					:label="t('change_pass.new')"
					class="account-input"
					type="password"
					:error="newPasswordError"
				/>

				<Button
					color="primary"
					expand="full"
					shape="round"
					class="save mt-5"
					:disabled="!password || !newPassword"
					@click="submit"
				>
					{{ t('change_pass.submit') }}
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
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import useLoader from '@/composables/common/useLoader.js';
import useAlert from '@/composables/common/alert.js';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { changePassword, authUserWithEmail } from '@/services/firebase/auth.js';
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n/index';

const validationSchema = yup.object().shape({
	password: yup.string().required('Field is required').nullable(),
	newPassword: yup
		.string()
		.required('Field is required')
		.min(8, 'Password must contain at least 8 characters')
		.nullable(),
});

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
		const store = useStore();
		const { showLoader, hideLoader } = useLoader();
		const { showMessage } = useAlert();
		const { t } = useI18n();

		const { setErrors, validate, resetForm } = useForm({
			validationSchema,
		});

		const email = computed(() => {
			return store.state.user.details.email;
		});

		const { value: password, errorMessage: passwordError } =
			useField('password');

		const { value: newPassword, errorMessage: newPasswordError } =
			useField('newPassword');

		const reauthenticate = () => {
			return authUserWithEmail({
				email: email.value,
				password: password.value,
			}).catch((e) => {
				if (e.code === 'auth/wrong-password') {
					setErrors({
						password: t('change_pass.invalid'),
					});
				}

				return false;
			});
		};

		const submit = async () => {
			const v = await validate();

			if (!v.valid) {
				return;
			}

			await showLoader();
			const result = await reauthenticate();

			if (!result) {
				hideLoader();
				return;
			}

			changePassword(newPassword.value)
				.then(() => {
					resetForm();
					showMessage({
						color: 'success',
						text: t('change_pass.updated'),
						title: t('common.success'),
					});

					hideLoader();
				})
				.catch((err) => {
					console.log(err);

					hideLoader();
					showMessage({
						text: t('common.something_wrong'),
					});
				});
		};

		return {
			chevronBackOutline,
			newPassword,
			newPasswordError,
			password,
			passwordError,
			submit,
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
</style>
