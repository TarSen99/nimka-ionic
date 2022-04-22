<template>
	<div
		ref="modal"
		class="view-image-modal-container is-flex"
		:class="{ isActive, closing, [`${imageDir}-dir`]: true }"
	>
		<div @click="closeImage" class="h-100 w-100 relative">
			<div class="close">
				<ion-icon :icon="closeOutline" class="fz-22" />
			</div>
			<div class="view-swiper">
				<swiper
					v-if="isSwiperVisible"
					:pagination="true"
					:modules="modules"
					:initialSlide="activeImageIndex"
				>
					<swiper-slide v-for="image in images" :key="image.id">
						<img :src="image.url" class="top-img" alt="" />
					</swiper-slide>
				</swiper>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, toRefs } from '@vue/reactivity';
import { nextTick, watch } from '@vue/runtime-core';
import { createGesture } from '@ionic/vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import { closeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';

export default {
	name: 'ViewImageModal',
	components: {
		Swiper,
		SwiperSlide,
		IonIcon,
	},
	props: {
		images: {
			type: Array,
			default: () => [],
		},
		modelValue: {
			type: String,
			default: null,
		},
		activeImageIndex: {
			type: Number,
			default: 0,
		},
	},
	emits: ['update:modelValue', 'hide-started'],
	setup(props, { emit }) {
		const { modelValue } = toRefs(props);
		const isActive = ref(false);
		const isSwiperVisible = ref(false);
		const closing = ref(false);
		const modules = [Pagination];
		const modal = ref();
		const imageDir = ref('top');
		let verticalGesture;

		watch(
			() => modelValue.value,
			(newV) => {
				if (!newV) {
					isActive.value = false;

					return;
				}

				isActive.value = true;
				isSwiperVisible.value = true;

				nextTick(() => {
					verticalGesture = createGesture({
						el: modal.value,
						threshold: 15,
						gestureName: 'verticalGesture',
						onMove: (ev) => onMoveHandler(ev),
						direction: 'y',
					});

					verticalGesture.enable();
				});
			}
		);

		const closeImage = () => {
			isActive.value = false;
			closing.value = true;
			emit('hide-started');

			setTimeout(() => {
				closing.value = false;
				isSwiperVisible.value = false;

				emit('update:modelValue', null);
			}, 300);
		};

		const onMoveHandler = (detail) => {
			const dist = 30;
			if (Math.abs(detail.deltaY) < dist) {
				return;
			}

			const deltaY = detail.deltaY;

			if (deltaY > dist) {
				imageDir.value = 'bottom';
			}

			if (deltaY < dist) {
				imageDir.value = 'top';
			}

			verticalGesture.destroy();

			nextTick(() => {
				closeImage();
			});
		};

		return {
			isActive,
			closeImage,
			closing,
			modules,
			closeOutline,
			modal,
			imageDir,
			isSwiperVisible,
		};
	},
};
</script>

<style scoped lang="scss">
::v-deep(.view-swiper) {
	.swiper-pagination {
		bottom: 20px;
		display: flex;
		align-items: center;
		justify-content: center;

		.swiper-pagination-bullet {
			background-color: var(--white);
			opacity: 0.8;
			width: 8px;
			height: 8px;
			transition: all 0.2s ease;
		}
		.swiper-pagination-bullet-active {
			opacity: 1;
			width: 11px;
			height: 11px;
		}
	}
}

.close {
	position: absolute;
	top: calc(var(--ion-safe-area-top) + 20px);
	right: 20px;
	color: var(--white);
	background: rgba(0, 0, 0, 0.05);
	width: 35px;
	height: 35px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: all 0.2s ease;
}

.view-image-modal-container {
	position: fixed;
	left: 0;
	top: 0;
	z-index: -1;
	background-color: transparent;
	transition: all 0.25s ease;

	&.isActive,
	&.closing {
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	&.isActive {
		background-color: var(--ion-color-light);

		.close {
			opacity: 1;
		}
	}

	&.closing {
		background-color: transparent !important;
	}

	.view-swiper {
		width: 100%;
		position: absolute;
		z-index: 5;
		top: 0;
		left: 0;
		transform: translate(0, 0);
	}

	&.isActive {
		.view-swiper {
			animation: 0.5s ease 0s 1 alternate forwards move_center;
		}
	}

	&.closing.top-dir {
		.view-swiper {
			animation: 0.3s ease 0s 1 alternate forwards move_top;
		}
	}

	&.closing.bottom-dir {
		.view-swiper {
			animation: 0.3s ease 0s 1 alternate forwards move_bottom;
		}
	}

	@keyframes move_center {
		from {
			top: 0;
			opacity: 0;
		}
		to {
			top: 50%;
			transform: translateY(-50%);
		}
	}

	@keyframes move_top {
		from {
			top: 50%;
			transform: translateY(-50%);
		}
		to {
			top: 0;
			opacity: 0;
		}
	}

	@keyframes move_bottom {
		from {
			top: 50%;
			transform: translateY(-50%);
		}
		to {
			top: 100%;
			opacity: 0;
			transform: translateY(0%);
		}
	}
}
</style>
