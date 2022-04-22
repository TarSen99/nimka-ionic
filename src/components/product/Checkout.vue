<template>
	<ion-fab
		vertical="bottom"
		horizontal="left"
		slot="fixed"
		class="w-100 bottom"
	>
		<div class="checkout-section ion-padding w-100" :class="{ hideOverlay }">
			<Button color="primary" expand="full" shape="round" @click="handleClick">
				Checkout ({{ price }} UAH)
			</Button>
		</div>
	</ion-fab>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { useRouter } from 'vue-router';
import { IonFab } from '@ionic/vue';

export default {
	name: 'Checkout',
	components: {
		Button,
		IonFab,
	},
	props: {
		price: {
			type: [Number, String],
			default: 0,
		},
		hideOverlay: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const router = useRouter();

		const handleClick = () => {
			router.push('/checkout');
		};
		// const v = toRefs(props);
		// console.log(v)
		return {
			handleClick,
		};
	},
};
</script>

<style lang="scss" scoped>
.checkout-section {
	background-color: rgba(255, 255, 255, 0.7);
	padding-bottom: calc(15px + var(--ion-safe-area-bottom));

	&.hideOverlay {
		background-color: transparent;
	}
}

.bottom {
	bottom: 0 !important;
}
</style>
