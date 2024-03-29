<template>
	<div>
		<div
			v-if="!loading && nearest.length"
			class="is-flex ion-justify-content-between"
		>
			<h2 class="fz-16 color-dark m-0 fw-500">{{ t('home.nearest') }}</h2>
		</div>

		<raw-placeholder v-if="loading" />

		<swiper
			v-else
			:slides-per-view="nearest.length > 1 ? 1.05 : 1"
			:space-between="nearest.length > 1 ? 5 : 0"
			class="mt-1"
		>
			<swiper-slide v-for="product in nearest" :key="product.id">
				<FoodItem
					:data="product"
					@click="$router.push(`/product/${product.id}`)"
				/>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { ref } from '@vue/reactivity';
import http from '@/services/http';
import { useStore } from 'vuex';

import { Swiper, SwiperSlide } from 'swiper/vue';
import FoodItem from '@/components/home/FoodItem.vue';
import RawPlaceholder from '@/components/common/RawPlaceholder.vue';
import { computed, onMounted } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'NearestProducts',
	components: {
		FoodItem,
		Swiper,
		SwiperSlide,
		RawPlaceholder,
	},
	setup() {
		const store = useStore();
		const loading = ref(false);
		const { t } = useI18n();

		const nearest = computed(() => {
			return store.state.nearest.nearest;
		});

		const getNearest = () => {
			if (nearest.value.length) {
				return;
			}

			loading.value = true;
			http
				.get('/products/nearest')
				.then((res) => {
					store.commit('nearest/updateNearest', res.data.data);
					loading.value = false;
				})
				.catch(() => {
					loading.value = false;
				});
		};

		onMounted(() => {
			getNearest();
		});

		return {
			nearest,
			loading,
			t,
		};
	},
};
</script>
