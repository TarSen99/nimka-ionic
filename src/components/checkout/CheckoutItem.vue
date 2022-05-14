<template>
	<div class="p-2 bg-white is-flex">
		<div class="img mr-4">
			<img :src="getImage(product.Images, product.productType)" alt="" />
		</div>

		<div
			class="w-100 content pt-2 is-flex is-flex-direction-column ion-justify-content-between ion-align-items-start"
		>
			<div>
				<h2
					class="color-dark fz-18"
					:class="{ niamboxTitle: product.productType === 'niambox' }"
				>
					{{ product.title }}
				</h2>

				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-14">
						{{ product.priceWithDiscount.toFixed(2) }} {{ t('common.uah') }}
					</span>
				</Badge>
			</div>

			<div
				class="counter w-100 is-flex ion-justify-content-end ion-align-items-center"
			>
				<span
					v-if="!hideButtons"
					class="mr-3 fz-20 fw-600 minus color-primary counter-btn is-flex ion-align-items-center ion-justify-content-center"
					:class="{
						disabled:
							(product.count === 1 && totalProductsCount === 1) || disabled,
					}"
					@click="handleRemoveProduct"
				>
					-
				</span>

				<span class="color-primary fw-500"
					>x<span class="fw-600 fz-18">{{ product.count }}</span></span
				>

				<span
					v-if="!hideButtons"
					@click="handleAdd"
					class="ml-3 fz-20 fw-600 color-white bg-primary counter-btn is-flex ion-align-items-center ion-justify-content-center"
					:class="{ disabled: addButtonDisabled || disabled }"
				>
					+
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';
import { toRefs } from '@vue/reactivity';
import { checkIfProductBuyAvailable } from '@/helpers';
import { computed } from '@vue/runtime-core';
import usePlaceholder from '@/composables/common/usePlaceholder.js';
import { useI18n } from 'vue-i18n/index';

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
		totalProductsCount: {
			type: Number,
			default: 0,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['changeCount'],
	setup(props, { emit }) {
		const { product, totalProductsCount, disabled } = toRefs(props);
		const { getImage } = usePlaceholder();
		const { t } = useI18n();

		const handleRemoveProduct = () => {
			if (disabled.value) {
				return;
			}

			if (product.value.count === 1 && totalProductsCount.value === 1) {
				return;
			}

			emit('changeCount', -1);
		};

		const addButtonDisabled = computed(() => {
			return checkIfProductBuyAvailable(product.value, product.value.count);
		});

		const handleAdd = () => {
			if (disabled.value) {
				return;
			}

			if (addButtonDisabled.value) {
				return;
			}

			emit('changeCount', 1);
		};

		return {
			handleRemoveProduct,
			addButtonDisabled,
			handleAdd,
			getImage,
			t,
		};
	},
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

.disabled {
	border-color: var(--ion-color-light) !important;
	background-color: var(--ion-color-light) !important;
	color: var(--ion-color-medium);
}
</style>
