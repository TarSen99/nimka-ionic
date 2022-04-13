<template>
	<div class="food-item is-flex">
		<div class="left relative">
			<div class="absolute time-take is-flex is-flex-direction-column">
				<Badge color="light">
					<span class="fz-14 color-dark">
						<ion-icon
							:icon="basketOutline"
							class="vertical-middle mr-1 fz-16 take-icon"
						></ion-icon>
						<span class="vertical-middle fz-14">
							{{ fromTime }} - {{ toTime }}
						</span>
					</span>
				</Badge>
			</div>

			<div class="img" :class="{ noImg: !data.Images || !data.Images.length }">
				<img
					:src="data.Images && data.Images[0] && data.Images[0].url"
					alt=""
				/>
			</div>
		</div>
		<div
			class="right p-3 is-flex is-flex-direction-column ion-justify-content-between"
		>
			<div>
				<div
					class="w-100 title-container is-flex ion-justify-content-between ion-align-items-center"
				>
					<h1 class="title fz-16">
						{{ data.title }}
					</h1>
				</div>

				<div v-if="data.Company" class="is-flex ion-align-items-center mt-1">
					<div class="company-logo mr-2">
						<img :src="data.Company.logo" alt="" />
					</div>
					<p class="fz-12 fw-400 subtitle color-dark-grey">
						{{ data.Company.name }}
					</p>
				</div>

				<div class="mt-1">
					<Badge v-if="!done" color="primary">
						{{ data.availableCount }} left
					</Badge>
				</div>

				<p class="description fz-12 dark mt-2">
					{{ data.description }}
				</p>
			</div>

			<!-- <Badge color="dark" class="mr-2"> -->
			<div
				class="is-flex ion-justify-content-between ion-align-items-center fz-14 color-dark-grey mt-1"
			>
				<div class="fz-12 distance no-wrap">
					<ion-icon :icon="navigateOutline" class="vertical-middle"></ion-icon>

					<span class="vertical-middle fz-12 fw-500">
						{{ (distance / 1000).toFixed(2) }}km
					</span>
				</div>

				<div class="no-wrap">
					<span class="fz-12 line-through mr-2">
						{{ data.fullPrice }} UAH
					</span>

					<span class="fw-600 fz-16"> {{ data.priceWithDiscount }} UAH </span>
				</div>
			</div>
			<!-- </Badge> -->
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { IonIcon } from '@ionic/vue';
import { navigateOutline, basketOutline } from 'ionicons/icons';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { DateTime } from 'luxon';

export default {
	name: 'FoodItem',
	components: {
		Badge,
		IonIcon,
	},
	props: {
		data: {
			type: Object,
			default: () => {},
		},
		done: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const { data } = toRefs(props);

		const fromTime = computed(() => {
			return DateTime.fromISO(data.value.takeTimeFrom).toFormat('HH:mm');
		});

		const toTime = computed(() => {
			return DateTime.fromISO(data.value.takeTimeTo).toFormat('HH:mm');
		});

		const distance = computed(() => {
			const dist = data.value.distance;
			const additional = (dist / 100) * 20;

			return (dist + additional).toFixed(2);
		});

		return {
			navigateOutline,
			basketOutline,
			fromTime,
			toTime,
			distance,
		};
	},
};
</script>

<style lang="scss" scoped>
.description {
	-webkit-line-clamp: 3;
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
		}

		.distance {
			color: var(--ion-color-dark);
		}
	}

	.right {
		width: calc(100% - 160px);

		.title {
			color: var(--ion-color-dark);
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
</style>
