<template>
	<ion-app>
		<!-- <notifications-list v-if="isAuthed" /> -->
		<Menu />
		<ion-router-outlet id="main"></ion-router-outlet>
	</ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useStore } from 'vuex';
import { onMounted } from '@vue/runtime-core';
import NotificationsList from '@/components/common/NotificationsList.vue';
import Menu from '@/components/common/Menu.vue';
import firebase from 'firebase/app';
import http from '@/services/http/index.js';
import { clearLs } from '@/helpers/index.js';
import 'firebase/auth';
import googleService from '@/services/google';
import paymentService from '@/services/payment';
import { signOut } from '@/services/firebase/auth.js';
import { useRouter, useRoute } from 'vue-router';
import { CURRENT_TOKEN } from '@/config/constants.js';
import useUserData from '@/composables/common/initUserData.js';
import usePushNotifications from '@/composables/common/pushNotifications.js';
import useAppFocus from '@/composables/common/appFocus.js';

export default {
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
		NotificationsList,
		Menu,
	},
	setup() {
		useAppFocus();

		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const { initUserData } = useUserData();
		const { addListeners, resetNotificationBadge } = usePushNotifications();

		http.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				console.log(error?.response);
				if (error?.response?.status === 401) {
					const roles = route.meta.roles || [];

					if (roles.includes('guest')) {
						throw error;
					}

					signOut();
					clearLs();
					// store.dispatch('company/updateRole', null);
					// store.dispatch('company/updateId', null);
					router.replace('/phone-register');
				}

				throw error;
			}
		);

		onMounted(() => {
			resetNotificationBadge();
			addListeners();
			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					return;
				}

				const token = await user.getIdToken();
				localStorage.setItem(CURRENT_TOKEN, token);
			});

			googleService.init();
			paymentService.init();
			initUserData();
		});
	},
};
</script>
