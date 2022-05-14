<template>
	<div>
		<div
			class="active-order color-white ion-padding fw-400 ion-text-center rounded"
			@click="handleCardClick"
		>
			<div>
				<ion-icon :icon="bicycleOutline" class="icon"></ion-icon>
			</div>

			<p v-if="activeOrders.length === 1">{{ t('home.you_have_active') }}</p>
			<p v-else>
				{{ t('home.you_have_actives') }}
			</p>

			<div v-if="activeOrders.length === 1">
				{{ t('home.take_it') }}
				<br />

				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-16"> {{ toTime }} </span>
				</Badge>
			</div>

			<p class="mt-2 fz-12">{{ t('home.click_here') }}</p>
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
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { getTimeFromIsoDate } from '@/helpers';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'ActiveOrder',
	components: {
		IonIcon,
		Badge,
		ActiveOrderModal,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const { t } = useI18n();

		const isModalOpen = ref(false);
		const activeOrders = computed(() => {
			return store.getters['myOrders/activeOrders'] || [];
		});

		const activeOrder = computed(() => {
			return store.getters['myOrders/activeOrders'][0];
		});

		const productData = computed(() => {
			const orderProducts = activeOrder.value?.OrderProducts || [];
			return orderProducts[0]?.productData || {};
		});

		const toTime = computed(() => {
			return getTimeFromIsoDate(productData.value.takeTimeTo);
		});

		const handleClose = () => {
			isModalOpen.value = false;
		};

		const handleCardClick = () => {
			if (activeOrders.value.length === 1) {
				isModalOpen.value = true;
				return;
			}

			router.push('/orders?active=true');
		};

		return {
			isModalOpen,
			bicycleOutline,
			handleClose,
			toTime,
			activeOrders,
			handleCardClick,
			t,
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
