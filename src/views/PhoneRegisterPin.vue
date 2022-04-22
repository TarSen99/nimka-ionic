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

							Please enter code from SMS here
						</h2>

						<div ref="inputs" class="is-flex">
							<div
								v-for="(item, index) in values"
								:key="index"
								class="px-1 code-input"
								@click="handleInputClickFocus(index)"
							>
								<input
									:value="item.value"
									:id="`input_${index}`"
									:maxlength="1"
									:max="9"
									type="tel"
									class="ion-code-input"
									@keydown="handleCodeInput(item, index)"
									@input="handleValueUpdate($event, index)"
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
import { computed } from '@vue/runtime-core';
import { chevronBackOutline } from 'ionicons/icons';
import useGeolocation from '@/composables/common/geoLocation.js';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http/index.js';
import { FIRST_TIME_OPEN } from '@/config/constants.js';

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

		const {
			handleCodeInput,
			code,
			values,
			handleInputFocus,
			handlePaste,
			verify,
			inputs,
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
			verify().then(async (valid) => {
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
			});
		};

		const handleValueUpdate = (v, index) => {
			const newV = (v.target.value || '') + '';

			if (newV.length === 6) {
				handlePaste(v, true);
				submit();
				return;
			}

			const oneDigit = newV.slice(newV.length - 1, newV.length);

			const test = /\d/.test(oneDigit);
			if (!test) {
				values[index].value = '0';
			} else {
				values[index].value = oneDigit;
			}

			if (code.value.length === values.length) {
				submit();
			}
		};

		const handleInputClickFocus = (index) => {
			handleInputFocus(index);
		};

		return {
			values,
			handleCodeInput,
			handleValueUpdate,
			handleInputFocus,
			handlePaste,
			chevronBackOutline,
			inputs,
			handleInputClickFocus,
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

// ::v-deep(.code-input) {
// 	.input-el {
// 		--padding-start: 0 !important;
// 		--padding-end: 0 !important;
// 		border-radius: 5px !important;
// 		--background: var(--ion-color-light);
// 		border-radius: 30px;
// 		--placeholder-color: var(--ion-color-medium);
// 		--placeholder-opacity: 1;

// 		input {
// 			padding: 2px;
// 			text-align: center;
// 			font-size: 20px;
// 			font-weight: 600;
// 		}
// 	}
// }

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

// .input-el {
// 	--background: var(--ion-color-light);
// 	border-radius: 30px;
// 	--placeholder-color: var(--ion-color-medium);
// 	--placeholder-opacity: 1;
// }

// ::v-deep(.input-el) {
// 	input {
// 		height: 50px;
// 		padding: 0 22px;
// 	}
// }

// .ion-code-input {
// 	background: var(--white);
// 	border-radius: 10px;

// 	height: 50px;
// 	text-align: center;
// 	text-align: center;
// 	font-size: 20px;
// 	font-weight: 600;
// 	width: ;
// }
</style>
