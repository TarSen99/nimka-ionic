<template>
	<div class="company-info p-3 is-flex ion-align-items-center">
		<div class="img mr-5">
			<img src="@/assets/images/logo.png" alt="" class="logo" />
		</div>

		<div class="text">
			<h2 class="fz-18 title">
				Best company
			</h2>
			<p class="fz-12">
				5 stars
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CompanyInfo',
};
</script>

<style scoped lang="scss">
.company-info {
	border-radius: 30px;
	background-color: var(--ion-color-dark);
}

.img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
    overflow: hidden;
}

.text {
    color: var(--white);
}
</style>
