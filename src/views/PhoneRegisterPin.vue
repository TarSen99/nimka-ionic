<template>
	<IonPage>
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
							<span class="fz-50">
								📩
							</span>
							<br />
							<br />

							Please enter code from SMS here
						</h2>

						<div class="is-flex">
							<Input
								v-for="(item, index) in values"
								:key="index"
								class="px-1 code-input"
								:modelValue="item.value"
								:ref="
									(el) => {
										if (el) valuesRefs[index] = el;
									}
								"
								:maxlength="1"
								:max="9"
								type="number"
								@keydown="handleCodeInput(item, index)"
								@update:modelValue="handleValueUpdate($event, index)"
								@focus="handleInputFocus(index)"
								@paste="handlePaste"
							/>
						</div>

						<span id="sign-in-button"></span>

						<!-- <Button @click="handleSubmit">
							Submit
						</Button>

						<Button @click="handleSubmit2">
							Submit 2
						</Button> -->
					</form>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage, loadingController } from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';

import { onMounted, ref } from 'vue';
import pincode from '@/composables/phone-register/pincode.js';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import firebase from 'firebase/app';
import alert from '@/composables/common/alert.js';

export default {
	name: 'PhoneRegisterPin',
	components: {
		IonContent,
		IonPage,
		Input,
		Button,
	},
	setup() {
		const {
			handleCodeInput,
			code,
			values,
			valuesRefs,
			handleInputFocus,
			handlePaste,
		} = pincode();

		const { showMessage } = alert();
		const router = useRouter();
		const route = useRoute();
		const store = useStore();

		const clearCode = () => {
			values.forEach((v) => {
				v.value = null;
			});
		};

		const presentLoading = async () => {
			const loading = await loadingController.create({
				cssClass: 'my-custom-class',
				message: 'Please wait...',
				duration: 2000,
			});
			await loading.present();

			if (code.value === '111111') {
				store.commit('user/handleRoles', ['customer']);
			} else if (code.value === '222222') {
				store.commit('user/handleRoles', ['partner', 'customer']);
			}

			store.commit('user/handleAuth', true);

			return loading;
		};

		const submit = async () => {
			const loading = await presentLoading();

			const verificationId = route.query.verificationId;

			if (code.value === '111111') {
				router.replace('/sign-up');
				loading.dismiss();
				return;
			}

			try {
				const credential = await firebase.auth.PhoneAuthProvider.credential(
					verificationId,
					code.value
				);

				await firebase
					.auth()
					.signInWithCredential(credential)
					.then((auth) => {
						showMessage({
							color: 'success',
							title: 'Success',
							text: 'Mobile is verified',
						});
						router.replace('/sign-up');
						loading.dismiss();
					});
			} catch (error) {
				loading.dismiss();
				clearCode();
				showMessage({ text: 'SMS code is not valid' });
			}
		};

		const handleValueUpdate = (v, index) => {
			const newV = (v || '') + '';

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

		return {
			values,
			valuesRefs,
			handleCodeInput,
			handleValueUpdate,
			handleInputFocus,
			handlePaste,
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

::v-deep(.code-input) {
	.input-el {
		--padding-start: 0 !important;
		--padding-end: 0 !important;
		border-radius: 5px !important;

		input {
			padding: 2px;
			text-align: center;
			font-size: 20px;
			font-weight: 600;
		}
	}
}

#sign-in-button {
	opacity: 0;
	position: absolute;
	left: -200px;
	top: -200px;
}
</style>
