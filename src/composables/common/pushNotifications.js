import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

import {
	PUSH_NOTIFICATIONS_DENIED,
	PUSH_NOTIFICATIONS_ASKED,
	PUSH_NOTIFICATIONS_SCREEN_SHOWED,
	CURRENT_PUSH_TOKEN,
} from '@/config/constants.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import http from '@/services/http';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default function () {
	const { setItem, getItem } = useNativeStore();
	const platform = Capacitor.getPlatform();
	const store = useStore();
	const router = useRouter();

	const handleNotification = (data) => {
		const type = data.type;

		if (type === 'product') {
			router.push(`/product/${data.id}`);
			return;
		}
	};

	const resetNotificationBadge = () => {
		if (platform === 'web') {
			return;
		}

		PushNotifications.removeAllDeliveredNotifications();
	};

	const isAuthed = computed(() => {
		return store.state.user.isAuthorizated;
	});

	const addListeners = async () => {
		if (store.state.user.pushListenersAdded) {
			return;
		}

		store.commit('user/changePushListenersAdded', true);

		if (platform === 'web') {
			return;
		}

		await PushNotifications.addListener('registration', async (token) => {
			console.log('REG COMPLETED');

			if (!isAuthed.value) {
				store.commit('user/changePushListenersAdded', false);
				console.log('NOT AUTHED');

				return;
			}

			const tokenValue = token.value;
			const savedValue = await getItem(CURRENT_PUSH_TOKEN);

			if (tokenValue === savedValue) {
				return;
			}

			await setItem(CURRENT_PUSH_TOKEN, tokenValue);

			return http.post('/token/create', {
				token: tokenValue,
				type: platform,
			});
		});

		// await PushNotifications.addListener('registrationError', (err) => {
		// 	console.error('Registration error: ', err.error);
		// });

		await PushNotifications.addListener(
			'pushNotificationReceived',
			(notification) => {
				// handleNotification(notification.data);
				console.log('Push notification received: ', notification);
			}
		);

		await PushNotifications.addListener(
			'pushNotificationActionPerformed',
			(notification) => {
				handleNotification(notification.notification.data);
				resetNotificationBadge();
			}
		);
	};

	const registerNotifications = async () => {
		if (store.state.user.notificationsAsked) {
			return;
		}

		console.log('ASK notifications');
		store.commit('user/changeNotificationsAsked', true);

		if (platform === 'web') {
			return;
		}

		let permStatus = await PushNotifications.checkPermissions();

		if (permStatus.receive === 'prompt') {
			await setItem(PUSH_NOTIFICATIONS_ASKED, 'yes');
			permStatus = await PushNotifications.requestPermissions();
		}

		if (permStatus.receive !== 'granted') {
			await setItem(PUSH_NOTIFICATIONS_ASKED, 'yes');
			await setItem(PUSH_NOTIFICATIONS_DENIED, 'yes');

			return;
		}

		console.log('Save token');

		await PushNotifications.register();
	};

	const setShowedScreen = async () => {
		return await setItem(PUSH_NOTIFICATIONS_SCREEN_SHOWED, 'yes');
	};

	return {
		addListeners,
		registerNotifications,
		resetNotificationBadge,
		setShowedScreen,
	};
}
