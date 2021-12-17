<template>
	<div
		class="checkout-section ion-padding-start ion-padding-end ion-padding-top"
	>
		<Button color="primary" expand="full" shape="round" @click="handleClick">
			Checkout {{ count }} items ({{ price }}hrn.)
		</Button>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { ref, toRefs } from '@vue/reactivity';
import { useRouter } from 'vue-router';

export default {
	name: 'Checkout',
	components: {
		Button,
	},
	props: {
		count: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			default: 0,
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
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.7);
	z-index: 2;
	padding-bottom: calc(15px + var(--ion-safe-area-bottom));
}
</style>
