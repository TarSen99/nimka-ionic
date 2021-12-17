<template>
	<div class="splash is-flex ion-align-items-center ion-justify-content-center">
		<h1 class="ion-text-center fz-50 fw-300">
			Niamka
		</h1>
	</div>
</template>

<script>
export default {
	name: 'Splash',
};
</script>

<style lang="scss" scoped>
.splash {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: var(--ion-color-primary);
	color: var(--white);
	z-index: 99999;

	// h1 {
	// 	font-family: 'Orelega One', cursive;
	// }
}
</style>
