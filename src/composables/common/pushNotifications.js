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

// const not = {
// 	data: {
// 		'gcm.message_id': '1650622163910289',
// 		fcm_options: {
// 			image:
// 				'https://niamka.s3.eu-central-1.amazonaws.com/images/1650612438337-1_5c99202aa7d3f.jpeg.jpeg',
// 		},
// 		id: '54',
// 		aps: {
// 			sound: 'default',
// 			'mutable-content': 1,
// 			'content-available': 1,
// 			alert: { title: "New product from П'ятниця", body: 'testt' },
// 		},
// 		'google.c.fid': 'e9olRtBvC2M',
// 		'google.c.sender.id': '1033159312679',
// 		type: 'product',
// 		'google.c.a.e': '1',
// 	},
// 	subtitle: '',
// 	body: 'testt',
// 	id: 'DDF6571A-0DE2-4E43-8088-A87CC0BC0498',
// 	badge: 1,
// 	title: "New product from П'ятниця",
// };

export default function () {
	const { setItem, removeItem, getItem } = useNativeStore();
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
			if (!isAuthed.value) {
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
				console.log('Performed');
				console.log(notification);
				handleNotification(notification.notification.data);
				resetNotificationBadge();
			}
		);
	};

	const registerNotifications = async () => {
		if (store.state.user.notificationsAsked) {
			return;
		}

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
