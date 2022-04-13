<template>
	<div>
		<swiper :slides-per-view="2.5" :space-between="5">
			<swiper-slide v-for="(slide, index) in modelValue" :key="slide.url">
				<div class="slide-element relative overflow-hidden">
					<button
						@click="handleRemove(index)"
						class="delete-btn fz-22 is-flex ion-justify-content-center ion-align-items-center"
					>
						<ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
					</button>
					<div
						class="img is-flex ion-justify-content-center ion-align-items-center"
					>
						<img :src="slide.url" alt="" />
					</div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { closeOutline } from 'ionicons/icons';
import { IonIcon, onIonViewDidEnter } from '@ionic/vue';
import { ref, toRefs } from '@vue/reactivity';

export default {
	name: 'ImagesSlider',
	components: { Swiper, SwiperSlide, IonIcon },
	props: {
		modelValue: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const { modelValue } = toRefs(props);

		const handleRemove = (index) => {
			const newArray = [...modelValue.value];
			newArray.splice(index, 1);

			emit('update:modelValue', newArray);
		};

		return {
			closeOutline,
			handleRemove,
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

		img {
			width: 100%;
			height: auto;
		}
	}

	// img {
	// 	height: 100%;
	// 	width: auto;
	// 	max-width: initial;
	// }
}

.descr {
	background-color: var(--white);
}

.delete-btn {
	width: 30px;
	height: 30px;
	position: absolute;
	right: 5px;
	top: 5px;
	border-radius: 50%;
	background: var(--ion-color-primary);
	color: var(--white);
	padding: 0;
}
</style>
