<template>
	<div>
		<swiper :slides-per-view="2.5" :space-between="5" ref="slider">
			<swiper-slide
				v-for="product in products"
				:key="product.id"
				@click="$router.replace(`/product/${product.id}`)"
				class="swiper-el"
			>
				<div class="slide-element relative overflow-hidden">
					<Badge color="danger" class="p-1 price absolute">
						<span class="fz-12">
							{{
								product.priceWithDiscount &&
								product.priceWithDiscount.toFixed(2)
							}}
							UAH
						</span>
					</Badge>

					<div class="img is-flex ion-justify-content-center">
						<img :src="getImage(product.Images, product.productType)" alt="" />
					</div>

					<div class="descr p-2">
						<h2
							class="fz-14"
							:class="{ niamboxTitle: product.productType === 'niambox' }"
						>
							{{ product.title }}
						</h2>
						<div class="view-description view-description-2">
							<p class="fz-14">{{ product.description }}</p>
						</div>
					</div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import Badge from '@/components/common/Badge.vue';
import usePlaceholder from '@/composables/common/usePlaceholder.js';

import { ref } from '@vue/reactivity';
export default {
	name: 'FoodSlider',
	components: { Swiper, SwiperSlide, Badge },
	props: {
		products: {
			type: Array,
			default: () => [],
		},
	},
	setup(_) {
		const items = ref([]);
		const slider = ref(null);
		const { getImage } = usePlaceholder();

		return {
			items,
			slider,
			getImage,
		};
	},
};
</script>

<style lang="scss" scoped>
.slide-element {
	width: 100%;
	height: 100%;
	border-radius: 10px;
	padding: 5px;
	background-color: var(--white);
	height: 230px;

	.img {
		width: 100%;
		height: 140px;
		border-radius: 10px;
		overflow: hidden;
	}

	img {
		height: 100%;
		width: auto;
		max-width: initial;
	}
}

.price {
	top: 10px;
	left: 10px;
}

.descr {
	background-color: var(--white);
}
</style>
