<template>
	<div>
		<div
			class="active-order color-white ion-padding fw-400 ion-text-center rounded"
			@click="isModalOpen = true"
		>
			<div>
				<ion-icon :icon="bicycleOutline" class="icon"></ion-icon>
			</div>
			<p>
				You have an active order
			</p>
			<div>
				Please take it till
				<br />

				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-16"> 20:00 </span>
				</Badge>
			</div>

			<p class="mt-2 fz-12">
				Click here for more details
			</p>
		</div>

		<active-order-modal :is-open="isModalOpen" @close="handleClose" />
	</div>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import { bicycleOutline } from 'ionicons/icons';
import Badge from '@/components/common/Badge.vue';
import ActiveOrderModal from '@/components/common/ActiveOrderModal.vue';
import { ref } from '@vue/reactivity';

export default {
	name: 'ActiveOrder',
	components: {
		IonIcon,
		Badge,
		ActiveOrderModal,
	},
	setup() {
		const isModalOpen = ref(false);

		const handleClose = () => {
			console.log('close');
			isModalOpen.value = false;
		};

		return {
			isModalOpen,
			bicycleOutline,
			handleClose,
		};
	},
};
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';

.active-order {
	@include theme-gradient-background;
}

.icon {
	font-size: 40px;
}
</style>
