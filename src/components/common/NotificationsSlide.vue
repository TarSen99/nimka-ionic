<template>
	<div class="notifications-container is-flex ion-justify-content-center">
		<transition name="notification">
			<notifications-list
				v-if="showNotification"
				@close="showNotification = false"
		/></transition>
	</div>
</template>

<script>
import NotificationsList from '@/components/common/NotificationsList.vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

export default {
	name: 'notifications',
	components: { NotificationsList },
	setup() {
		const showNotification = ref(false);

		onMounted(() => {
			setTimeout(() => {
				showNotification.value = true;
			}, 1000);
		});

		return {
			showNotification,
		};
	},
};
</script>

<style lang="scss" scoped>
.notifications-container {
	position: fixed;
	width: 100%;
	left: 0;
	top: 65px;
	z-index: 1;
}
</style>
