import alert from '@/composables/common/alert.js';
import firebase from 'firebase/app';
import { useRoute } from 'vue-router';
import pincode from '@/composables/phone-register/pincode.js';
import { useStore } from 'vuex';
import { Capacitor } from '@capacitor/core';
import 'firebase/auth';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http';
import { computed } from 'vue';
import realtime from '@/services/firebase/db.js';
import { ENCRYPTED_KEY } from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';

export default function () {
	const platform = Capacitor.getPlatform();
	const { showLoader, hideLoader } = useLoader();
	const { showMessage } = alert();
	const { setItem } = useNativeStore();

	const store = useStore();
	const route = useRoute();

	const phone = computed(() => {
		return store.state.register.phone;
	});

	const { handlePaste, focusMainElement, codeEl, currentPin, CODE_LENGTH } =
		pincode();

	const clearCode = () => {
		currentPin.value = '';
	};

	const handleUserLogin = async (user) => {
		const token = await user.getIdToken();

		return http
			.post('/users/create/phone', {
				phone: phone.value,
				token,
			})
			.then(async (res) => {
				hideLoader();
				const data = res.data.data;
				const encypted = res.data.encypted;
				await setItem(ENCRYPTED_KEY, JSON.stringify(encypted));
				store.dispatch('user/updateDetails', { ...data, token });

				realtime.connect(data.id);

				return true;
			})
			.catch(() => {
				showMessage({ text: 'Something went wrong' });
				clearCode();
				hideLoader();
			});
	};

	const verifyMobile = async () => {
		showLoader();
		const verificationId = route.query.verificationId;

		try {
			const credential = await firebase.auth.PhoneAuthProvider.credential(
				verificationId,
				currentPin.value
			);

			return await firebase
				.auth()
				.signInWithCredential(credential)
				.then(async ({ user }) => {
					return handleUserLogin(user);
				});
		} catch (error) {
			clearCode();

			hideLoader();
			showMessage({ text: 'SMS code is not valid' });
			throw new Error('erroe');
		}
	};

	const verifyMobileWeb = () => {
		showLoader();

		return window.confirmationResult
			.confirm(currentPin.value)
			.then(async (result) => {
				const user = result.user;
				return handleUserLogin(user);
			})
			.catch((err) => {
				if (!err) {
					return;
				}

				clearCode();
				hideLoader();
				showMessage({ text: 'SMS code is not valid' });
				throw new Error('erroe');
			});
	};

	const verify = () => {
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

		if (platform === 'web') {
			return verifyMobileWeb();
		}

		return verifyMobile();
	};

	return {
		handlePaste,
		verify,
		codeEl,
		focusMainElement,
		currentPin,
		CODE_LENGTH,
	};
}
