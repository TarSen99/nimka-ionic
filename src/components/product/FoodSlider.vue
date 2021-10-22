<template>
	<div>
		<swiper :slides-per-view="2.5" :space-between="5" ref="slider" :width="375">
			<swiper-slide v-for="slide in items" :key="slide">
				<div class="slide-element relative overflow-hidden">
					<Badge color="danger" class="p-1 price absolute">
						<span class="fz-12">
							50hrn.
						</span>
					</Badge>

					<div class="img">
						<img src="@/assets/images/product.png" alt="" />
					</div>

					<div class="descr p-2">
						<h2 class="fz-14">
							Fresh burger
						</h2>
						<p class="fz-14">
							Take it...
						</p>
					</div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import Badge from '@/components/common/Badge.vue';

import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
export default {
	name: 'FoodSlider',
	components: { Swiper, SwiperSlide, Badge },
	setup(_) {
		const items = ref([1, 2, 3, 4]);
		const slider = ref(null);

		// onMounted(() => {
		// 	slider.value.init();
		// });

		return {
			items,
			slider,
		};
	},
};
</script>

<style lang="scss" scoped>
.slide-element {
	width: 100%;
	height: 100%;
	border-radius: 10px;

	.img {
		width: 100%;
		height: 140px;
	}

	img {
		width: auto;
        min-height: 100%;
	}
}

.price {
	top: 5px;
	left: 5px;
}

.descr {
	background-color: var(--white);
}
</style>
