<template>
	<div>
		<div
			class="active-order color-white ion-padding fw-400 ion-text-center rounded"
			@click="$router.push('/incoming-orders')"
		>
			<p>
				You have <span class="color-light fz-18 fw-500">2</span> active orders
			</p>

			<p class="mt-2 fz-12">
				Click here for more details
			</p>
		</div>
	</div>
</template>

<script>
export default { name: 'ActiveIncomingOrders' };
</script>

<style lang="scss" scoped>
@import '@/theme/mixins.scss';

.active-order {
	@include theme-gradient-background;
}
</style>
