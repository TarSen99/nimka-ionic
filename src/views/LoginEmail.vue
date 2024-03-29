<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-justify-content-between"
			>
				<div ref="topText">
					<TopIcons> {{ t('login_page.hello') }}!</TopIcons>
				</div>

				<div class="bottom-screen relative w-100">
					<BorderedBackground class="absolute background" />
					<div
						class="position-relative logo-container is-flex is-flex-direction-column ion-align-items-center"
					>
						<div class="logo">
							<img src="@/assets/icons/logo_nimka.svg" alt="" />
						</div>
					</div>

					<form @submit.prevent class="w-100 ion-padding">
						<Input
							v-model="email"
							:placeholder="t('common.email')"
							:label="t('common.email')"
							class="w-100 login-input"
							:error="emailError"
						/>
						<Input
							v-model="password"
							:placeholder="t('common.password')"
							:label="t('common.password')"
							class="w-100 login-input"
							type="password"
							:error="passwordError"
						/>

						<div class="w-100 mt-5 z-2 relative pt-5">
							<Button color="light" class="mt-5" expand="block" @click="submit">
								{{ t('login_page.login') }}
							</Button>

							<div
								class="ion-text-center pb-5 is-flex ion-align-items-center ion-justify-content-center mt-2"
							>
								<ion-icon :icon="arrowBackOutline" class="color-light mr-1" />

								<span
									class="color-light fz-14 fw-600"
									@click="$router.replace('/phone-register')"
								>
									{{ t('login_page.back') }}
								</span>
							</div>
						</div>
					</form>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage, IonFab } from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import { IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import TopIcons from '@/components/signUp/TopIcons.vue';
import BorderedBackground from '@/components/common/BorderedBackground.vue';
import http from '@/services/http';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { authUserWithEmail } from '@/services/firebase/auth.js';
import {
	FIREBASE_ERROR_CODES,
	FIRST_TIME_OPEN,
	ENCRYPTED_KEY,
} from '@/config/constants.js';
import useLoader from '@/composables/common/useLoader.js';
import { getErrors } from '@/helpers';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import realtime from '@/services/firebase/db.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import { useI18n } from 'vue-i18n/index';
import i18n from '@/i18n.js';

const { t } = i18n.global;

const validationSchema = yup.object().shape({
	loginValue: yup
		.string()
		.email(t('common.email_not_valid'))
		.required(t('common.required')),
	password: yup.string().required(t('common.required')),
});

export default {
	name: 'PhoneRegister',
	components: {
		IonContent,
		IonPage,
		Input,
		Button,
		IonFab,
		IonIcon,
		TopIcons,
		BorderedBackground,
	},
	setup() {
		const { t } = useI18n();

		const store = useStore();
		const router = useRouter();
		const { activePlace, places } = useCurrentPlace();
		const { setItem } = useNativeStore();

		const { setErrors, setFieldError, validate } = useForm({
			validationSchema,
		});

		const { showLoader, hideLoader } = useLoader();

		const { value: email, errorMessage: emailError } = useField('loginValue');
		const { value: password, errorMessage: passwordError } =
			useField('password');

		const loginUser = (token) => {
			http
				.post('/users/login', {
					loginValue: email.value,
					token,
				})
				.then(async (res) => {
					const data = res.data.data;
					const encypted = res.data.encypted;
					await setItem(ENCRYPTED_KEY, JSON.stringify(encypted));

					localStorage.setItem(FIRST_TIME_OPEN, true);

					const company = (data.Companies && data.Companies[0]) || {};

					store.dispatch('user/updateDetails', { ...data, token });
					await store.dispatch('company/fetchDetails', company.id);
					realtime.connect(res.data.data.id);

					if (activePlace.value) {
						router.replace('/');
						return;
					}

					if (places.value && places.value.length === 1) {
						store.dispatch('user/updatePlace', places.value[0].id);
						router.replace('/');
						return;
					}

					router.replace('/places/select');
				})
				.catch((err) => {
					setErrors(getErrors(err));
				})
				.finally(() => {
					hideLoader();
				});
		};

		const submit = async () => {
			const v = await validate();

			if (!v.valid) {
				return;
			}

			showLoader();

			authUserWithEmail({ email: email.value, password: password.value })
				.then(async (user) => {
					hideLoader();
					if (!user) {
						return;
					}

					const token = await user.getIdToken();

					loginUser(token);
				})
				.catch((err) => {
					hideLoader();
					setFieldError(
						'password',
						FIREBASE_ERROR_CODES[err.code] || err.message
					);
				});
		};

		return {
			arrowBackOutline,
			email,
			password,
			submit,
			emailError,
			passwordError,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.bottom-screen {
	min-height: 600px;
}

.page-content {
	max-height: 100vh;
	min-height: 100vh;
	// background: linear-gradient(
	// 	180deg,
	// 	$gradientTopColor 0.39%,
	// 	$gradientBottomColor 70.34%
	// );
}

.logo {
	width: 120px;
	position: relative;
}

.or {
	display: block;
	position: relative;

	&::before,
	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 30px;
		width: 30%;
		height: 1px;
		background-color: var(--ion-color-light);
		top: 50%;
		transform: translateY(-50%);
	}

	&::after {
		left: initial;
		right: 30px;
	}
}

::v-deep(.login-input) {
	.error {
		color: var(--ion-color-light) !important;
	}
}

.z-2 {
	z-index: 2;
}
</style>
