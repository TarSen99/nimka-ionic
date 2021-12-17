<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
			>
				<div class="bottom-screen relative w-100" ref="bottomScreen">
					<form
						class="form ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
						@submit.prevent="handleSubmit"
					>
						<h2 class="ion-text-center color-white mb-5 fw-400 fz-16">
							<span class="fz-50">
								📱
							</span>
							<br />
							<br />
							Please enter your phone number.
						</h2>

						<div class="is-flex">
							<div
								class="is-flex ion-align-items-center ion-justify-content-center number-prefix color-white fw-500 fz-20 px-2"
							>
								+380
							</div>
							<Input
								class="code-input w-100"
								v-model="phone"
								type="tel"
								placeholder="00-000-00-00"
								:maxlength="9"
							/>
						</div>
					</form>
				</div>
			</div>

			<ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
				<div class="ion-padding w-100">
					<Button
						color="light"
						expand="block"
						@click="submit"
						:disabled="submitDisabled || isSubmitting"
					>
						Continue
					</Button>
				</div>
			</ion-fab>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage, loadingController, IonFab } from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	cfaSignInPhone,
	cfaSignInPhoneOnCodeSent,
} from 'capacitor-firebase-auth';
import alert from '@/composables/common/alert.js';

const PHONE_LENGTH = 9;

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
		const router = useRouter();
		const phone = ref(null);
		const isSubmitting = ref(false);
		const { showMessage } = alert();

		let loading;

		const submit = async () => {
			cfaSignInPhoneOnCodeSent().subscribe((verificationId) => {
				isSubmitting.value = false;
				loading.dismiss();
				router.replace(`/phone-register-pin?verificationId=${verificationId}`);
			});

			loading = await loadingController.create();

			await loading.present();

			isSubmitting.value = true;

			cfaSignInPhone(`+380${phone.value}`).subscribe({
				next: (verificationId) => {
					console.log('at next cfaSignInPhoneOnCodeSent!');
					console.log(verificationId);
				},
				error: (error) => {
					isSubmitting.value = false;
					console.log('at error cfaSignInPhoneOnCodeSent!');
					loading.dismiss();

					console.log(error);

					showMessage({ text: 'Phone number is invalid' });
				},
				complete: () => {
					console.log('at complete cfaSignInPhoneOnCodeSent!');
				},
			});
		};

		const submitDisabled = computed(() => {
			const str = (phone.value || '') + '';
			return str.length !== PHONE_LENGTH;
		});

		return {
			phone,
			submit,
			submitDisabled,
			isSubmitting,
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
</style>
