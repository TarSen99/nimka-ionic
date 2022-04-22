<template>
	<div class="food-item is-flex">
		<div class="left relative">
			<div class="absolute time-take is-flex is-flex-direction-column">
				<Badge class="status-badge" :class="data.status">
					<span class="fw-500 fz-14"> {{ statusText }} </span>
				</Badge>
			</div>

			<div
				class="w-100 h-100 is-flex img-size ion-wrap"
				:class="`img-size-${products.length}`"
			>
				<div
					v-for="product in products"
					:key="product.id"
					class="img mr-1 mb-1"
				>
					<img :src="getImage(product.Images)" alt="" />
				</div>
			</div>
		</div>
		<div
			class="right pt-3 pb-3 pr-3 pl-1 is-flex is-flex-direction-column ion-justify-content-between"
		>
			<div>
				<div
					class="w-100 title-container is-flex ion-justify-content-between ion-align-items-center"
				>
					<h1 class="title fz-16">
						{{ data.title }}
					</h1>
				</div>

				<div v-if="data.Company">
					<div class="is-flex ion-align-items-center">
						<div class="company-logo mr-2">
							<img :src="data.Company.logo" alt="" />
						</div>
						<p class="fz-12 fw-500 subtitle color-dark-grey">
							{{ data.Company.name }}
						</p>
					</div>
					<p class="fz-12 color-grey mt-2">
						{{ data.Place.address }}
					</p>
				</div>
			</div>

			<div
				class="is-flex ion-justify-content-end ion-align-items-center fz-14 color-dark-grey mt-1"
			>
				<div class="no-wrap">
					<span class="fw-600 fz-16">
						{{ data.totalPrice.toFixed(2) }} UAH
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { IonIcon } from '@ionic/vue';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import usePlaceholder from '@/composables/common/usePlaceholder.js';

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
		const { getImage } = usePlaceholder();

		const products = computed(() => {
			return data.value.OrderProducts.map((p) => {
				return p.productData;
			}).slice(0, 4);
		});

		const statusText = computed(() => {
			const status = (data.value.status || ' ').replace('_', ' ');

			return `${status[0].toUpperCase()}${status.slice(1, status.length)}`;
		});

		return {
			products,
			statusText,
			getImage,
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

		.img-size {
			img,
			.img {
				width: 70px;
				height: 70px;
			}
		}

		.img-size-1 {
			img,
			.img {
				width: 150px;
				height: 150px;
			}
		}

		.img {
			border-radius: 10px;
			overflow: hidden;
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

.status-badge {
	&.to_take,
	&.payed {
		background-color: var(--ion-color-success) !important;
	}

	&.pending {
		background-color: var(--ion-color-primary) !important;
	}

	&.completed {
		background-color: var(--ion-color-success) !important;
	}

	&.cancelled,
	&.expired {
		background-color: var(--ion-color-danger) !important;
	}
}
</style>
