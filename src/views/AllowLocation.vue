<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
			>
				<div class="bottom-screen relative w-100" ref="bottomScreen">
					<div
						class="form ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
					>
						<h2 class="ion-text-center color-dark mb-5 fz-18 fw-500 geo">
							<span class="fz-50"> 📍 </span>
							<br />
							<br />
							{{ t('allow_location.receive_best') }}
						</h2>
					</div>
				</div>
			</div>

			<span id="sign-in-button"> </span>

			<ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
				<div class="ion-padding w-100">
					<Button color="light" expand="block" @click="submit">
						{{ t('allow_location.allow_geo') }}
					</Button>

					<div class="ion-text-center">
						<span class="fw-600 color-light fz-14 mt-2" @click="skip">
							{{ t('common.skip') }}</span
						>
					</div>
				</div>
			</ion-fab>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage, IonFab } from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import useLocation from '@/composables/common/geoLocation.js';
import useLoader from '@/composables/common/useLoader.js';
import { useRouter } from 'vue-router';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings';
import useSaveLocation from '@/composables/auth/saveLocation.js';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'PhoneRegister',
	components: {
		IonContent,
		IonPage,
		Input,
		Button,
		IonFab,
	},
	setup() {
		const store = useStore();
		const { t } = useI18n();

		const { getCurrentLocation, setLocationNotAllowed, getDeniedValue } =
			useLocation();
		const { showLoader, hideLoader } = useLoader();
		const { updateAddress } = useSaveLocation();
		const router = useRouter();

		const hasHardcodedAddress = computed(() => {
			return !!store.state.user.details.address;
		});

		const submit = async () => {
			const isDenied = await getDeniedValue();

			if (isDenied) {
				await OpenNativeSettings.open('location');
				router.replace('/');

				return;
			}

			await showLoader();
			getCurrentLocation()
				.then((res) => {
					if (!res) {
						hideLoader();
						router.replace('/push/allow');
					}

					if (hasHardcodedAddress.value) {
						hideLoader();

						router.replace('/push/allow');

						return;
					}

					const { latitude, longtitude } = res;
					updateAddress({ latitude, longtitude }).then(() => {
						hideLoader();
						router.replace('/push/allow');
					});
				})
				.catch(() => {
					hideLoader();
				});
		};

		const skip = async () => {
			await setLocationNotAllowed('yes');
			router.replace('/push/allow');
		};

		return {
			submit,
			skip,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.number-prefix {
	height: 50px;
	color: #ec5230;
	background-color: var(--ion-color-light);
	border-top-left-radius: 30px;
	border-bottom-left-radius: 30px;
}

.page-content {
	max-height: 100vh;
	min-height: 100vh;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);
}

::v-deep(.code-input) {
	.input-el {
		border-top-left-radius: 0 !important;
		border-bottom-left-radius: 0 !important;

		input {
			padding-left: 10px;
			font-weight: 500;
			font-size: 20px;
		}
	}
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

.geo {
	background: var(--white);
	padding: 30px 20px;
	border-radius: 20px;
}
</style>
