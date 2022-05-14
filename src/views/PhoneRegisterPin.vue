<template>
	<IonPage>
		<IonHeader class="header" mode="md">
			<IonToolbar class="toolbar" mode="md" ref="header">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
				>
					<IonButtons>
						<ion-button
							class="back-btn default-icon-btn"
							@click.prevent="$router.replace('/phone-register')"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</IonButtons>
				</div>
			</IonToolbar>
		</IonHeader>

		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
			>
				<div class="bottom-screen relative" ref="bottomScreen">
					<form
						class="form ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
						@submit.prevent="handleSubmit"
					>
						<h2 class="ion-text-center color-white mb-5 fw-400 fz-16">
							<span class="fz-50"> 📩 </span>
							<br />
							<br />

							{{ t('login_page.enter_otp') }}
						</h2>

						<div>
							<input
								type="tel"
								ref="codeEl"
								class="pin-value"
								:maxlength="CODE_LENGTH"
								v-model="currentPin"
								@paste="handlePaste"
								@input="handleValueUpdate"
							/>
						</div>

						<div ref="inputs" class="is-flex">
							<div
								v-for="(item, index) in CODE_LENGTH"
								:key="index"
								class="px-1 code-input"
								@click="focusMainElement"
							>
								<input
									:value="currentPin[index] || ''"
									type="tel"
									class="ion-code-input"
									@paste="handlePaste"
								/>
							</div>
						</div>

						<span id="sign-in-button"></span>
					</form>
				</div>
			</div>
		</IonContent>
	</IonPage>
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
	IonInput,
} from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import verifyPin from '@/composables/auth/verifyPin.js';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted } from '@vue/runtime-core';
import { chevronBackOutline } from 'ionicons/icons';
import useGeolocation from '@/composables/common/geoLocation.js';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http/index.js';
import { FIRST_TIME_OPEN } from '@/config/constants.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'PhoneRegisterPin',
	components: {
		IonContent,
		IonPage,
		Input,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		Button,
		IonIcon,
		IonInput,
	},
	setup() {
		const router = useRouter();
		const store = useStore();
		const { getCurrentLocation, getNotAllowedValue } = useGeolocation();
		const { showLoader, hideLoader } = useLoader();
		const { t } = useI18n();

		const {
			handlePaste,
			verify,
			codeEl,
			focusMainElement,
			currentPin,
			CODE_LENGTH,
		} = verifyPin();

		const hasLocation = computed(() => {
			return !!store.state.user.details.latitude;
		});

		const saveLocation = ({ latitude, longtitude }) => {
			return http.put('/users/update', {
				...store.state.user.details,
				latitude,
				longtitude,
			});
		};

		const submit = async () => {
			verify()
				.then(async (valid) => {
					if (!valid) {
						return;
					}

					localStorage.setItem(FIRST_TIME_OPEN, true);
					const notAllowed = await getNotAllowedValue();

					if (!hasLocation.value || notAllowed) {
						router.replace('/location/allow');
					} else {
						await showLoader();
						const location = await getCurrentLocation();

						if (location) {
							await saveLocation(location);
						}

						hideLoader();
						router.replace('/');
					}
				})
				.catch(() => {
					codeEl.value.focus();
				});
		};

		const handleValueUpdate = () => {
			if (currentPin.value.length === 6) {
				submit();
			}
		};

		onMounted(() => {
			setTimeout(() => {
				codeEl.value.focus();
			});
		});

		return {
			CODE_LENGTH,
			handleValueUpdate,
			handlePaste,
			chevronBackOutline,
			codeEl,
			currentPin,
			focusMainElement,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.page-content {
	max-height: 100vh;
	min-height: 100vh;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);
}

.code-input {
	width: 100%;
	input {
		padding: 2px;
		text-align: center;
		font-size: 20px;
		font-weight: 600;
		border-radius: 5px;
		outline: none;
		border: none;
		width: 100%;
		line-height: 40px;
	}
}

#sign-in-button {
	opacity: 0;
	position: absolute;
	left: -200px;
	top: -200px;
}

.header {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
}

.back-btn {
	--padding-bottom: 15px !important;
	--padding-top: 15px !important;
	--padding-start: 15px !important;
	--padding-end: 15px !important;
	height: 50px !important;
	width: 50px !important;
}

.pin-value {
	opacity: 0;
	outline: none;
	position: absolute;
	left: 0;
	top: 0;
	height: 0;
	width: 0;
	color: transparent;
	caret-color: transparent;
}
</style>
