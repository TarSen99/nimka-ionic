<template>
	<div
		class="top-sreen is-flex ion-align-items-center ion-justify-content-center relative"
	>
		<h1 class="fw-400 fz-40 relative z-index-2 ion-text-center">
			<slot></slot>
		</h1>

		<div class="images">
			<span class="burger absolute">
				<img src="@/assets/icons/BurgerIcon-1.png" alt="" />
			</span>

			<span class="plate absolute">
				<img src="@/assets/icons/PlateIcon-1.png" alt="" />
			</span>

			<span class="olives absolute">
				<img src="@/assets/icons/OlivesIcon-1.png" alt="" />
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.top-sreen {
	min-height: 30vh;
}

.burger {
	left: 0;
	top: 0;
	transform: translate(-50%, -50%);
	width: 205px;
}

.plate {
	right: 0;
	top: 50px;
	transform: translate(50%, 0);
	width: 200px;
}

.olives {
	width: 75px;
	left: 50px;
	bottom: 10px;
}
</style>
