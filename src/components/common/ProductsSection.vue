<template>
	<div :class="{ [activeClass]: products && products.length }">
		<div
			v-if="!loading && products.length && title"
			class="is-flex ion-justify-content-between mb-2"
		>
			<h2
				class="fz-16 color-dark m-0 fw-500 section-title is-flex ion-align-items-center"
			>
				<span> <slot name="pre"></slot> </span>
				<span>
					{{ title }}
				</span>
			</h2>
		</div>

		<raw-placeholder v-if="loading" />

		<swiper v-else :slides-per-view="1.3" :space-between="5" class="mt-1">
			<swiper-slide v-for="product in products" :key="product.id">
				<FoodItem
					:data="product"
					optimized
					@click="$router.push(`/product/${product.id}`)"
				/>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import FoodItem from '@/components/home/FoodItem.vue';
import RawPlaceholder from '@/components/common/RawPlaceholder.vue';

export default {
	name: 'ProductsSection',
	components: {
		Swiper,
		SwiperSlide,
		FoodItem,
		RawPlaceholder,
	},
	props: {
		products: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: null,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		activeClass: {
			type: String,
			default: null,
		},
	},
};
</script>
