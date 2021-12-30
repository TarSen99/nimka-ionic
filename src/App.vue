<template>
	<ion-app>
		<notifications-list v-if="isAuthed" />
		<!-- <transition name="fade">
			<Splash v-if="showSplash" />
		</transition> -->
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
import NotificationsList from '@/components/common/NotificationsList.vue';

export default {
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
		Splash,
		NotificationsList,
	},
	setup() {
		const store = useStore();
		const isAuthorized = computed(() => store.state.user.isAuthorizated);
		// const { showSplash } = spash();

		const isAuthed = computed(() => {
			return store.state.user.isAuthorizated;
		});

		onMounted(() => {
			initFirebase();
		});

		return {
			isAuthorized,
			// showSplash,
			isAuthed,
		};
	},
};
</script>
