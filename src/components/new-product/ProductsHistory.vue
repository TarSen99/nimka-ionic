<template>
	<div>
		<h2 class="fz-18 color-dark fw-500">Products history</h2>

		<div>
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
							<div class="img is-flex">
								<img src="@/assets/images/product.png" alt="" />
							</div>
							<div
								class="is-flex is-flex-direction-column ion-align-items-start p-2"
							>
								<span class="fz-12 fw-400 is-flex color-dark-grey">
									<span class="decoration-line-through"> 100 UAH</span>
									<span class="ml-2 fw-500"> 50 UAH</span>
								</span>
								<span class="fz-14 fw-500 mt-2"> Product title </span>
								<div class="description-container">
									<p class="description fz-12">
										Lorem ipsum, dolor sit amet consectetur adipisicing elit.
										Ratione similique ut ab culpa, rem sint quasi, voluptatem
										vel ducimus, quam neque cupiditate quos perferendis
										architecto ex voluptates? Perferendis, quam sapiente?
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

export default {
	name: 'ProductsHistory',
	components: {
		Swiper,
		SwiperSlide,
		Badge,
	},
	emits: ['prefill'],
	setup(_, { emit }) {
		const swiper = ref(null);
		const { screenWidthPadding } = useScreen();

		const products = [
			{
				id: 1,
				title: 'test',
				description: 'description',
				availableCount: 2,
				availableCountPerPerson: 2,
				fullPrice: 105,
				discountPercent: 25,
				discountPrice: 78,
				startTime: new Date(),
				endTime: new Date(),
			},
			{
				id: 2,
				title: 'test 2',
				description: 'description',
				availableCount: 2,
				availableCountPerPerson: 2,
				fullPrice: 105,
				discountPercent: 25,
				discountPrice: 78,
				startTime: new Date(),
				endTime: new Date(),
			},
			{
				id: 3,
				title: 'test 3',
				description: 'description',
				availableCount: 2,
				availableCountPerPerson: 2,
				fullPrice: 105,
				discountPercent: 25,
				discountPrice: 78,
				startTime: new Date(),
				endTime: new Date(),
			},
		];

		const prefillData = (data) => {
			emit('prefill', data);
		};

		return {
			products,
			swiper,
			screenWidthPadding,
			prefillData,
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
		height: 100px;
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
