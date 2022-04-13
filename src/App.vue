<template>
	<ion-app>
		<notifications-list v-if="isAuthed" />
		<Menu />
		<ion-router-outlet id="main"></ion-router-outlet>
	</ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useStore } from 'vuex';
import { computed, ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import NotificationsList from '@/components/common/NotificationsList.vue';
import Menu from '@/components/common/Menu.vue';
import firebase from 'firebase/app';
import http from '@/services/http/index.js';
import 'firebase/auth';
import useLoader from '@/composables/common/useLoader.js';
import googleService from '@/services/google';
import { signOut } from '@/services/firebase/auth.js';
import { useRouter } from 'vue-router';
import { CURRENT_TOKEN } from '@/config/constants.js';
import useGeolocation from '@/composables/common/geoLocation.js';

export default {
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
		NotificationsList,
		Menu,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const isAuthorized = computed(() => store.state.user.isAuthorizated);
		const isInited = ref(false);
		const { getCurrentLocation, cachedGeolocation } = useGeolocation();
		const { showLoader, hideLoader } = useLoader();

		const isAuthed = computed(() => {
			return store.state.user.isAuthorizated;
		});

		http.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response.status === 401) {
					signOut();
					localStorage.clear();
					store.dispatch('company/updateRole', null);
					store.dispatch('company/updateId', null);
					router.replace('/phone-register');
				}

				return Promise.reject(error);
			}
		);

		onMounted(() => {
			getCurrentLocation();

			firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					return;
				}

				const token = await user.getIdToken();
				localStorage.setItem(CURRENT_TOKEN, token);
			});

			googleService.init();
		});

		return {
			isAuthorized,
			isAuthed,
			isInited,
		};
	},
};
</script>
