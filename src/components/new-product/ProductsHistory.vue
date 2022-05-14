<template>
	<div>
		<h2 class="fz-16 color-dark fw-500">{{ t('new_product.last') }}</h2>
		<p class="fz-12 color-grey">{{ t('new_product.click') }}</p>

		<div class="mt-2">
			<div v-if="loading" class="is-flex">
				<ion-item
					v-for="(item, index) in 10"
					:key="index"
					color="item"
					class="mb-3 placeholder-item"
					lines="none"
				>
					<ion-thumbnail slot="start" class="logo">
						<ion-skeleton-text animated></ion-skeleton-text>
					</ion-thumbnail>
					<ion-label class="h-100 pt-2 is-flex is-flex-direction-column pb-5">
						<div>
							<p class="pt-1">
								<ion-skeleton-text
									animated
									style="width: 100%"
								></ion-skeleton-text>
							</p>
						</div>
						<p class="pt-2">
							<ion-skeleton-text
								animated
								style="width: 100%"
							></ion-skeleton-text>
						</p>
					</ion-label>
				</ion-item>
			</div>

			<swiper
				:slides-per-view="1.2"
				:space-between="8"
				ref="swiper"
				:width="screenWidthPadding"
			>
				<swiper-slide v-for="slide in products" :key="slide.id">
					<div
						class="slide-element relative overflow-hidden"
						@click="prefillData(slide)"
					>
						<div class="is-flex product-card">
							<div class="img-container">
								<div class="img is-flex">
									<img
										:src="getImage(slide.Images, slide.productType)"
										alt=""
									/>
								</div>
							</div>

							<div
								class="is-flex is-flex-direction-column ion-align-items-start p-2"
							>
								<span class="fz-12 fw-400 is-flex color-dark-grey">
									<span class="decoration-line-through">
										{{ slide.fullPrice && slide.fullPrice.toFixed(2) }}
										{{ t('common.uah') }}</span
									>
									<span class="ml-2 fw-500">
										{{
											slide.priceWithDiscount &&
											slide.priceWithDiscount.toFixed(2)
										}}
										{{ t('common.uah') }}</span
									>
								</span>
								<span class="fz-14 fw-500 mt-2"> {{ slide.title }} </span>
								<div class="description-container">
									<p class="description fz-12">
										{{ slide.description }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</swiper-slide>
			</swiper>
		</div>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import Badge from '@/components/common/Badge.vue';
import { ref } from '@vue/reactivity';
import useScreen from '@/composables/screen/screen.js';
import usePlaceholder from '@/composables/common/usePlaceholder.js';
import {
	IonIcon,
	IonItem,
	IonLabel,
	IonSkeletonText,
	IonThumbnail,
} from '@ionic/vue';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'ProductsHistory',
	components: {
		Swiper,
		SwiperSlide,
		Badge,
		IonIcon,
		IonItem,
		IonLabel,
		IonSkeletonText,
		IonThumbnail,
	},
	emits: ['prefill'],
	props: {
		products: {
			type: Array,
			default: () => [],
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	setup(_, { emit }) {
		const swiper = ref(null);
		const { screenWidthPadding } = useScreen();
		const { getImage } = usePlaceholder();
		const { t } = useI18n();

		const prefillData = (data) => {
			emit('prefill', data);
		};

		return {
			swiper,
			screenWidthPadding,
			prefillData,
			getImage,
			t,
		};
	},
};
</script>

<style lang="scss" scoped>
.placeholder-item {
	width: 300px;
	min-width: 300px;
	--padding-start: 0;
	padding: 4px;

	.logo {
		width: 90px;
		height: 90px;
		border-radius: 10px;
		overflow: hidden;
	}
}
.slide-element {
	width: 100%;
	height: 100%;
	border-radius: 5px;

	.img-container {
		padding: 4px;
	}

	.img {
		height: 100px;
		width: 100px;
		border-radius: 10px;
		overflow: hidden;
	}

	img {
		height: 100%;
		width: auto;
		max-width: initial;
	}
}

.badge {
	top: 5px;
	left: 5px;
}

.product-card {
	background: var(--white);
}

.description {
	margin: 0; /* Убираем внешний отступ */
	-webkit-line-clamp: 2; /* Число отображаемых строк */
	display: -webkit-box; /* Включаем флексбоксы */
	-webkit-box-orient: vertical; /* Вертикальная ориентация */
	overflow: hidden;
	text-overflow: ellipsis;
	width: 95%;
}
</style>
