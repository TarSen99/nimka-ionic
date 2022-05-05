<template>
	<ion-app>
		<notifications-list v-if="isAuthed && isCompany" />
		<Menu />
		<Modals v-if="isAuthed" />
		<ion-router-outlet id="main"></ion-router-outlet>
	</ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useStore } from 'vuex';
import { computed, onMounted } from '@vue/runtime-core';
import NotificationsList from '@/components/common/NotificationsList.vue';
import Menu from '@/components/common/Menu.vue';
import firebase from 'firebase/app';
import http from '@/services/http/index.js';
import { clearLs } from '@/helpers/index.js';
import 'firebase/auth';
import googleService from '@/services/google';
import paymentService from '@/services/payment';
import realtime from '@/services/firebase/db.js';
import { signOut } from '@/services/firebase/auth.js';
import { useRouter, useRoute } from 'vue-router';
import {
	CURRENT_TOKEN,
	USER_DETAILS,
	ROLES,
	CURRENT_REFRESH_TOKEN,
} from '@/config/constants.js';
import useUserData from '@/composables/common/initUserData.js';
import usePushNotifications from '@/composables/common/pushNotifications.js';
import useAppFocus from '@/composables/common/appFocus.js';
import useNativeStore from '@/composables/common/nativeStore.js';
import Modals from '@/components/common/Modals.vue';

export default {
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
		NotificationsList,
		Menu,
		Modals,
	},
	setup() {
		useAppFocus();
		const { getItem } = useNativeStore();

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

		const isAuthed = computed(() => {
			return store.state.user.isAuthorizated;
		});

		const isCompany = computed(() => {
			return store.state.user.role && store.state.user.role !== ROLES.CUSTOMER;
		});

		onMounted(() => {
			resetNotificationBadge();
			addListeners();
			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					realtime.disconnect();

					return;
				}

				const token = await user.getIdToken();
				localStorage.setItem(CURRENT_TOKEN, token);
				localStorage.setItem(CURRENT_REFRESH_TOKEN, user.refreshToken);

				const userDetails = await getItem(USER_DETAILS);
				const userData = JSON.parse(userDetails || '{}');

				if (!userData.id) {
					return;
				}

				if (userData.id) {
					realtime.connect(userData.id);
				}
			});

			googleService.init();
			paymentService.init();
			initUserData();
		});

		return {
			isAuthed,
			isCompany,
		};
	},
};
</script>
