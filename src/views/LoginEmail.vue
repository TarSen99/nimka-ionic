<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-justify-content-between"
			>
				<div ref="topText">
					<TopIcons> Hello!</TopIcons>
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
							placeholder="Email"
							label="Email"
							class="w-100 login-input"
							:error="emailError"
						/>
						<Input
							v-model="password"
							placeholder="Password"
							label="Password"
							class="w-100 login-input"
							type="password"
							:error="passwordError"
						/>

						<div class="w-100 mt-5 z-2 relative pt-5">
							<Button color="light" class="mt-5" expand="block" @click="submit">
								Log in
							</Button>

							<div
								class="ion-text-center pb-5 is-flex ion-align-items-center ion-justify-content-center mt-2"
							>
								<ion-icon :icon="arrowBackOutline" class="color-light mr-1" />

								<span class="color-light fz-14 fw-600" @click="$router.back()">
									Back
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
import { FIREBASE_ERROR_CODES, FIRST_TIME_OPEN } from '@/config/constants.js';
import useLoader from '@/composables/common/useLoader.js';
import { getErrors } from '@/helpers';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const validationSchema = yup.object().shape({
	loginValue: yup
		.string()
		.email('Email is not valid')
		.required('Field is required'),
	password: yup.string().required('Field is required'),
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
		const store = useStore();
		const router = useRouter();

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
					localStorage.setItem(FIRST_TIME_OPEN, true);

					const company = (data.Companies && data.Companies[0]) || {};

					store.dispatch('user/updateDetails', { ...data, token });
					await store.dispatch('company/fetchDetails', company.id);

					router.replace('/');
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
