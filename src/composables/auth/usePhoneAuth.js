import {
	cfaSignInPhone,
	cfaSignInPhoneOnCodeSent,
} from 'capacitor-firebase-auth';
import { useRouter } from 'vue-router';
import { loadingController } from '@ionic/vue';
import alert from '@/composables/common/alert.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default function ({ getNumber, phone }) {
	const router = useRouter();
	const isSubmitting = ref(false);
	const { showMessage } = alert();
	const store = useStore();

	const platform = Capacitor.getPlatform();
	let loading;

	const onWebNounted = () => {
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
			'sign-in-button',
			{
				size: 'invisible',
				callback: (response) => {
					// reCAPTCHA solved, allow signInWithPhoneNumber.
					sendVerificationCodeWeb();
				},
			}
		);
	};

	onMounted(() => {
		if (platform === 'web') {
			onWebNounted();
		}
	});

	const sendVerificationCodeWeb = () => {
		const auth = firebase.auth();

		auth
			.signInWithPhoneNumber(getNumber(), window.recaptchaVerifier)
			.then((confirmationResult) => {
				store.commit('register/updatePhone', getNumber());

				window.confirmationResult = confirmationResult;
				router.replace(`/phone-register-pin`);
			});
	};

	const sendVerificationCodeMobile = async () => {
		loading = await loadingController.create();
		cfaSignInPhoneOnCodeSent().subscribe((verificationId) => {
			store.commit('register/updatePhone', getNumber());

			isSubmitting.value = false;
			loading.dismiss();
			router.replace(`/phone-register-pin?verificationId=${verificationId}`);
		});

		await loading.present();

		isSubmitting.value = true;

		cfaSignInPhone(`+380${phone.value}`).subscribe({
			next: (verificationId) => {},
			error: (error) => {
				console.log('----------------');
				console.log(error);
				isSubmitting.value = false;
				loading.dismiss();

				showMessage({ text: 'Phone number is invalid' });
			},
		});
	};

	const sendVirificationCode = () => {
		if (platform === 'web') {
			sendVerificationCodeWeb();
			return;
		}

		sendVerificationCodeMobile();
	};

	return {
		sendVirificationCode,
		isSubmitting,
	};
}
