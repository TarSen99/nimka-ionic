<template>
	<ion-app>
		<notifications-slide />
		<transition name="fade">
			<Splash v-if="showSplash" />
		</transition>
		<ion-router-outlet></ion-router-outlet>
	</ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';
import { initFirebase } from '@/services/firebase/init.js';
import { onMounted } from '@vue/runtime-core';
import Splash from '@/components/common/Splash.vue';
import spash from '@/composables/common/spash.js';
import NotificationsSlide from '@/components/common/NotificationsSlide.vue';

export default {
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
		Splash,
		NotificationsSlide,
	},
	setup() {
		const store = useStore();
		const isAuthorized = computed(() => store.state.user.isAuthorizated);
		const { showSplash } = spash();

		onMounted(() => {
			initFirebase();
		});

		return {
			isAuthorized,
			showSplash,
		};
	},
};
</script>
