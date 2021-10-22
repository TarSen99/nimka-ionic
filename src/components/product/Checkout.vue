<template>
	<div class="checkout-section ion-padding">
		<Button color="primary" expand="full" shape="round">
			Checkout ({{ count }})
		</Button>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { ref, toRefs } from '@vue/reactivity';

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
	},
	setup(props) {
		// const v = toRefs(props);
		// console.log(v)
		// return {  };
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
}
</style>
