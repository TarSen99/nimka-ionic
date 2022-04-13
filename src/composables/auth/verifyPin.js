import alert from '@/composables/common/alert.js';
import firebase from 'firebase/app';
import { useRouter, useRoute } from 'vue-router';
import pincode from '@/composables/phone-register/pincode.js';
import { useStore } from 'vuex';
import { Capacitor } from '@capacitor/core';
import 'firebase/auth';
import useLoader from '@/composables/common/useLoader.js';
import http from '@/services/http';
import { computed, ref } from 'vue';
import { CURRENT_USER_KEY, ROLES, CURRENT_TOKEN } from '@/config/constants.js';

export default function () {
	const platform = Capacitor.getPlatform();
	const { showLoader, hideLoader } = useLoader();
	const { showMessage } = alert();
	const store = useStore();
	const router = useRouter();
	const route = useRoute();

	const phone = computed(() => {
		return store.state.register.phone;
	});

	const pinIsDisabled = ref(false);

	const {
		handleCodeInput,
		code,
		values,
		valuesRefs,
		handleInputFocus,
		handlePaste,
	} = pincode();

	const clearCode = () => {
		values.forEach((v) => {
			v.value = null;
		});
	};

	const handleUserLogin = async (user) => {
		const token = await user.getIdToken();

		http
			.post('/users/create/phone', {
				phone: phone.value,
				token,
			})
			.then((res) => {
				hideLoader();
				const data = res.data.data;
				const company = (data.Companies && data.Companies[0]) || {};
				const role = company.UsersAndCompanies?.role;

				localStorage.setItem(CURRENT_USER_KEY, data.id);
				localStorage.setItem(CURRENT_TOKEN, token);

				store.dispatch('company/updateId', company.id);
				store.dispatch('company/updateRole', role || ROLES.CUSTOMER);
				store.commit('user/handleAuth', true);
				store.commit('user/handleRole', role || ROLES.CUSTOMER);

				showMessage({
					color: 'success',
					title: 'Success',
					text: 'Mobile is verified',
				});

				router.replace('/');
			})
			.catch(() => {
				clearCode();
				showMessage({ text: 'Something went wrong' });
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
					handleUserLogin(user);
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
				handleUserLogin(user);
			})
			.catch((err) => {
				if (!err) {
					return;
				}

				hideLoader();
				clearCode();
				showMessage({ text: 'SMS code is not valid' });
			});
	};

	const verify = () => {
		pinIsDisabled.value = true;
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

		if (platform === 'web') {
			verifyMobileWeb().finally(() => {
				setTimeout(() => {
					pinIsDisabled.value = false;
				});
			});
			return;
		}

		verifyMobile().finally(() => {
			setTimeout(() => {
				pinIsDisabled.value = false;
			});
		});
	};

	return {
		handleCodeInput,
		code,
		values,
		valuesRefs,
		handleInputFocus,
		handlePaste,
		verify,
		pinIsDisabled,
	};
}
