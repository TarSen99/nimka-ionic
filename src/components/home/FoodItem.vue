<template>
	<div class="food-item is-flex">
		<div class="left relative">
			<div class="absolute time-take is-flex is-flex-direction-column">
				<Badge v-if="done" color="success">
					<span>
						Done
					</span>
				</Badge>

				<Badge v-if="!done" color="primary">
					<span>
						Take 18:00 - 20:00
					</span>
				</Badge>

				<div v-if="!done">
					<Badge color="light" class="mt-1">
						<div class="fz-12 distance">
							<ion-icon
								:icon="navigateOutline"
								class="vertical-middle"
							></ion-icon>

							<span class="vertical-middle">
								1.2km
							</span>
						</div>
					</Badge>
				</div>
			</div>

			<div class="absolute discount-content">
				<Badge
					v-if="!done"
					color="danger"
					class="border-top-right-no-radius border-bottom-right-no-radius border-bottom-left-no-radius px-5"
				>
					<span>
						50%
					</span>
				</Badge>
			</div>

			<div class="img">
				<img src="@/assets/images/product.png" alt="" />
			</div>
		</div>
		<div class="right p-5 w-100">
			<div
				class="w-100 title-container is-flex ion-justify-content-between ion-align-items-center"
			>
				<h1 class="title fz-16">
					{{ title || 'Tasty burger' }}
				</h1>
			</div>

			<p class="fz-12 subtitle">
				{{ subtitle || 'Company name' }}
			</p>

			<div class="mt-2">
				<Badge color="dark" class="mr-2">
					<span class="line-through mr-2">
						100
					</span>

					<span>
						50hrn.
					</span>
				</Badge>

				<Badge v-if="!done" color="primary">
					5 left
				</Badge>
			</div>

			<p class="description fz-12 dark mt-2">
				This burger includes meet and someother stuff. Doesn’t metter...
			</p>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { IonIcon } from '@ionic/vue';
import { navigateOutline } from 'ionicons/icons';

export default {
	name: 'FoodItem',
	components: {
		Badge,
		IonIcon,
	},
	props: {
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
	setup() {
		return {
			navigateOutline,
		};
	},
};
</script>

<style lang="scss" scoped>
.food-item {
	border-radius: 10px;
	background-color: var(--white);
	width: 100%;
	overflow: hidden;

	.left {
		height: 150px;
		width: 150px;
		min-width: 150px;
		background-color: var(--ion-color-light-shade);
		overflow: hidden;

		.img {
			width: 100%;
			height: 100%;

			img {
				min-width: 100%;
				min-height: 100%;
				width: auto;
			}
		}

		.time-take {
			top: 5px;
			left: 10px;
		}

		.discount-content {
			right: 0;
			bottom: -1px;
		}

		.distance {
			color: var(--ion-color-dark);
		}
	}

	.right {
		.title {
			color: var(--ion-color-dark);
		}

		.subtitle {
			color: var(--ion-color-medium);
		}
	}
}
</style>
