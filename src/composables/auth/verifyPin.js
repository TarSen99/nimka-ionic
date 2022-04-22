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
import { ROLES } from '@/config/constants.js';

export default function () {
	const platform = Capacitor.getPlatform();
	const { showLoader, hideLoader } = useLoader();
	const { showMessage } = alert();
	const store = useStore();
	const route = useRoute();

	const phone = computed(() => {
		return store.state.register.phone;
	});

	const {
		handleCodeInput,
		code,
		values,
		handleInputFocus,
		handlePaste,
		inputs,
	} = pincode();

	const clearCode = () => {
		values.forEach((v) => {
			v.value = null;
		});
	};

	const handleUserLogin = async (user) => {
		const token = await user.getIdToken();

		return http
			.post('/users/create/phone', {
				phone: phone.value,
				token,
			})
			.then((res) => {
				hideLoader();
				const data = res.data.data;
				// const company = (data.Companies && data.Companies[0]) || {};
				// const role = company.UsersAndCompanies?.role;

				// store.dispatch('company/updateId', company.id);
				// store.dispatch('company/updateRole', role || ROLES.CUSTOMER);
				store.dispatch('user/updateDetails', { ...data, token });

				// showMessage({
				// 	color: 'success',
				// 	title: 'Success',
				// 	text: 'Mobile is verified',
				// });

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
				code.value
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
		}
	};

	const verifyMobileWeb = () => {
		showLoader();

		return window.confirmationResult
			.confirm(code.value)
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
		handleCodeInput,
		code,
		values,
		handleInputFocus,
		handlePaste,
		verify,
		inputs,
	};
}
