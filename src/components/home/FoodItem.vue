<template>
	<div
		class="food-item relative is-flex"
		:class="{
			hideCompany,
			optimized,
			niambox: data.productType === 'niambox',
			outOfStock:
				data.status === PRODUCT_STATUSES.OUT_OF_STOCK ||
				data.status === PRODUCT_STATUSES.EXPIRED,
		}"
	>
		<div class="left relative">
			<slot name="default"></slot>
			<div
				v-if="data.status === PRODUCT_STATUSES.ACTIVE && data.availableCount"
				class="absolute time-take is-flex is-flex-direction-column"
			>
				<Badge color="white">
					<span
						v-if="data.availableCount < 100"
						class="fz-14 color-dark fw-500"
					>
						{{ data.availableCount }} left
					</span>

					<span v-else class="fz-12 color-dark fw-600"> Left a lot </span>
				</Badge>
			</div>

			<div class="img">
				<img :src="images[0].url" alt="" />
			</div>
		</div>
		<div
			class="right pt-3 pb-3 pr-2 pl-1 is-flex is-flex-direction-column ion-justify-content-between"
		>
			<div>
				<div
					class="w-100 title-container is-flex is-flex-direction-column ion-align-items-start"
				>
					<div
						v-if="data.status === PRODUCT_STATUSES.ACTIVE"
						class="pickup-time"
					>
						<span class="fz-12 fw-400 color-dark vertical-align-middle">
							Pick up
						</span>

						<span class="fz-12 color-dark fw-400 vertical-align-middle">
							today
						</span>

						<span class="fz-12 color-dark fw-400 vertical-align-middle">
							{{ fromTime }} - {{ toTime }}
						</span>
					</div>
					<h1
						v-if="data.productType === 'regular'"
						class="title fz-16 mt-1 color-dark-grey"
					>
						{{ data.title }}
					</h1>
					<h1 v-else class="title niambox-title fz-16 mt-1 color-dark-grey">
						Niambox
					</h1>
				</div>

				<div
					v-if="data.Company"
					class="is-flex ion-align-items-center mt-2 company-info"
				>
					<div class="company-logo mr-2">
						<img :src="data.Company.logo" alt="" />
					</div>
					<p class="fz-12 fw-400 subtitle color-dark-grey">
						{{ data.Company.name }}
					</p>
				</div>

				<p class="description fz-12 dark mt-2">
					{{ data.description }}
				</p>
			</div>

			<div
				class="is-flex ion-justify-content-between ion-align-items-end fz-14 color-dark-grey mt-1"
			>
				<div class="fz-12 distance no-wrap">
					<template v-if="distance">
						<ion-icon
							:icon="navigateOutline"
							class="vertical-middle mr-1"
						></ion-icon>

						<span class="vertical-middle fz-12 fw-500"> {{ distance }}km </span>
					</template>
				</div>

				<div class="is-flex is-flex-direction-column ion-align-items-end">
					<span class="fz-12 line-through old-price">
						{{ data.fullPrice.toFixed(2) }} UAH
					</span>

					<span class="fw-600 fz-16 price">
						{{ data.priceWithDiscount.toFixed(2) }} UAH
					</span>
				</div>
			</div>
		</div>

		<EmodjiStatus
			v-if="data.status === PRODUCT_STATUSES.OUT_OF_STOCK && !adminView"
			emodji="😥"
			text="Out of stock"
			color="danger"
		/>

		<EmodjiStatus
			v-if="data.status === PRODUCT_STATUSES.EXPIRED && !adminView"
			emodji="🙁"
			text="You missed it"
			color="primary"
		/>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { IonIcon } from '@ionic/vue';
import { navigateOutline, basketOutline } from 'ionicons/icons';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import { distanceToKm } from '@/helpers';
import { PRODUCT_STATUSES } from '@/config/constants.js';
import usePlaceholder from '@/composables/common/usePlaceholder.js';
import EmodjiStatus from '@/components/home/EmodjiStatus.vue';

export default {
	name: 'FoodItem',
	components: {
		Badge,
		IonIcon,
		EmodjiStatus,
	},
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
		adminView: {
			type: Boolean,
			default: false,
		},
		optimized: {
			type: Boolean,
			default: false,
		},
		hideCompany: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const { data } = toRefs(props);
		const { getImages } = usePlaceholder();

		const fromTime = computed(() => {
			return DateTime.fromISO(data.value.takeTimeFrom).toFormat('HH:mm');
		});

		const toTime = computed(() => {
			return DateTime.fromISO(data.value.takeTimeTo).toFormat('HH:mm');
		});

		const distance = computed(() => {
			const value = distanceToKm(data.value.distance);

			if (value > 20) {
				return '20+';
			}

			return distanceToKm(data.value.distance);
		});

		const images = computed(() => {
			return getImages(data.value.Images, data.value.productType);
		});

		return {
			navigateOutline,
			basketOutline,
			fromTime,
			toTime,
			distance,
			PRODUCT_STATUSES,
			images,
		};
	},
};
</script>

<style lang="scss" scoped>
.outOfStock {
	.left,
	.right {
		filter: grayscale(1);
	}
}

.description {
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
}

.food-item {
	border-radius: 10px;
	background-color: var(--white);
	width: 100%;
	overflow: hidden;
	max-height: 160px;

	.left {
		height: 160px;
		width: 160px;
		min-width: 150px;
		overflow: hidden;
		padding: 5px;

		.img {
			width: 100%;
			height: 100%;
			border-radius: 10px;
			overflow: hidden;
			position: relative;

			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				background: #000;
				opacity: 0.02;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 2;
			}

			&.noImg {
				background: var(--ion-color-light-tint);
			}

			img {
				min-width: 100%;
				min-height: 100%;
				width: auto;
			}
		}

		.time-take {
			top: 10px;
			left: 10px;
			z-index: 3;
		}

		.distance {
			color: var(--ion-color-dark);
		}
	}

	.right {
		width: calc(100% - 160px);

		.title {
			-webkit-line-clamp: 2;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;

			// color: var(--ion-color-dark);
		}

		.subtitle {
			// color: var(--ion-color-medium);
		}
	}
}

.company-logo {
	width: 25px;
	height: 25px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
	}
}

.take-icon {
	--ionicon-stroke-width: 40px;
}

.out-badge {
	z-index: 3;
	top: 10px;
	left: 10px;
}

.take {
	padding: 0px 7px !important;
}

.optimized {
	.title {
		font-size: 14px !important;
		-webkit-line-clamp: 1 !important;
	}

	.company-info {
		position: absolute;
		left: 10px;
		bottom: 10px;
		background: var(--white);
		padding: 5px;
		border-radius: 20px;

		.subtitle {
			max-width: 55px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.price,
	.old-price {
		font-size: 12px;
	}

	.left {
		height: 120px;
		width: 120px;
		min-width: 120px;
	}

	.right {
		width: calc(100% - 120px);
	}
}

.optimized.outOfStock {
	.company-info {
		display: none !important;
	}
}

.pickup-time {
	font-size: 12px;
}

.hideCompany {
	.company-info {
		display: none !important;
	}
}

.niambox {
	.title {
		color: var(--ion-color-primary);
	}
}

// .pickup-time {
// 	box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.06);
// 	border-radius: 30px;
// 	padding: 0 5px;
// }
</style>
