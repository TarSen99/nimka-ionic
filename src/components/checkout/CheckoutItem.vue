<template>
	<div class="p-2 bg-white is-flex">
		<div class="img mr-4">
			<img src="@/assets/images/product.png" alt="" />
		</div>

		<div
			class="w-100 content pt-2 is-flex is-flex-direction-column ion-justify-content-between ion-align-items-start"
		>
			<div>
				<h2 class="color-dark fz-18">
					Tasty burger
				</h2>

				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-14"> {{ product.price }} UAN </span>
				</Badge>
			</div>

			<div
				class="counter w-100 is-flex ion-justify-content-end ion-align-items-center"
			>
				<span
					v-if="!hideButtons"
					@click="$emit('changeCount', -1)"
					class="mr-3 fz-20 fw-600 minus color-primary counter-btn is-flex ion-align-items-center ion-justify-content-center"
				>
					-
				</span>
				<span v-else class="btn-placeholder"> </span>

				<span class="color-primary fw-500"
					>x<span class="fw-600 fz-18">{{ product.count }}</span></span
				>

				<span
					v-if="!hideButtons"
					@click="$emit('changeCount', 1)"
					class="ml-3 fz-20 fw-600 color-white bg-primary counter-btn is-flex ion-align-items-center ion-justify-content-center"
				>
					+
				</span>
				<span v-else class="btn-placeholder"> </span>
			</div>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';

export default {
	name: 'CheckoutItem',
	components: {
		Badge,
	},
	props: {
		product: {
			type: Object,
			default: () => {},
		},
		hideButtons: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['changeCount'],
};
</script>

<style lang="scss" scoped>
.img {
	width: 100px;
	min-width: 100px;
	height: 100px;
	border-radius: 10px;
	overflow: hidden;

	img {
		min-height: 100%;
		min-width: 100%;
		width: auto;
	}
}

.counter-btn {
	width: 30px;
	height: 30px;
	border-radius: 50%;
}

.minus {
	border: 2px solid var(--ion-color-primary);
}

.btn-placeholder {
	display: inline-block;
	min-width: 20px;
}
</style>
