<template>
	<ion-modal
		:is-open="isOpen"
		:breakpoints="[0, 0.5]"
		:initialBreakpoint="0.5"
		css-class="error-modal"
		@willDismiss="$emit('close')"
	>
		<ion-content>
			<div class="bg-white ion-padding h-100 position-relative">
				<h3 class="color-danger fz-18 ion-text-center">
					<span class="color-dark fw-500">Sorry!</span> <br />
					<span class="fw-400 fz-14">We got an error</span>
				</h3>

				<p class="mt-3 fz-14 color-dark">
					Unfortunately, some products from your order are out of stock.
				</p>

				<div class="is-flex mt-5 product">
					<div class="image">
						<img :src="productImages[0] && productImages[0].url" alt="" />
					</div>

					<div class="pl-3">
						<div class="color-dark fw-500 fz-20 pt-3">
							{{ errorProduct.title }}
						</div>
						<p
							class="fz-14 view-description view-description-2 color-grey-dark mt-2"
						>
							{{ errorProduct.description }}
						</p>
					</div>
				</div>

				<div class="is-flex ion-justify-content-center">
					<Button
						color="primary"
						expand="block"
						class="px-5 w-100 ok-btn"
						@click="handleClose"
					>
						I got it
					</Button>
				</div>
			</div>
		</ion-content>
	</ion-modal>
</template>

<script>
import { IonModal, IonContent, modalController } from '@ionic/vue';
import { toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import Button from '@/components/common/Button.vue';

export default {
	name: 'ErrorModal',
	components: {
		IonModal,
		IonContent,
		Button,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		errorData: {
			type: Array,
			default: () => [],
		},
		products: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['close'],
	setup(props) {
		const { errorData, products } = toRefs(props);

		const errorProduct = computed(() => {
			const errorText = errorData.value[0]?.error || ' ';
			const splitted = errorText.split('||');
			const id = splitted[0]?.split('.')[1];

			const product = products.value.find((el) => el.id === +id);

			return product || {};
		});

		const productImages = computed(() => {
			const images = errorProduct.value && errorProduct.value.Images;

			return images || [];
		});

		const handleClose = () => {
			modalController.dismiss();
		};

		return {
			productImages,
			errorProduct,
			handleClose,
		};
	},
};
</script>

<style lang="scss" scoped>
.image {
	width: 120px;
	min-width: 120px;
	height: 120px;
	overflow: hidden;
	border-radius: 10px;

	.img {
		width: 100%;
	}
}

.product {
	border-radius: 15px;
	border: 2px solid var(--ion-color-danger);
}

.ok-btn {
	margin-top: 5vh;
}
</style>
