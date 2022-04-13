<template>
	<div>
		<div class="company-info p-3 is-flex ion-align-items-center">
			<div class="img mr-5">
				<img :src="details && details.logo" alt="" class="logo" />
			</div>

			<div class="text">
				<h2 class="fz-18 title">
					{{ details && details.name }}
				</h2>
				<!-- <p class="fz-12">
				5 stars
			</p> -->
			</div>
		</div>

		<div class="mt-2 pl-3">
			<div
				class="social-item is-flex ion-align-items-center ion-justify-content-between"
				@click="handleSocialClick"
			>
				<span class="fz-14 color-grey social-link"> google.com </span>

				<div class="social-logo inst mr-2">
					<img src="@/assets/icons/instagram.svg" alt="" />
				</div>
			</div>

			<div
				class="social-item is-flex ion-align-items-center mt-2 ion-justify-content-between"
				@click="handleSocialClick"
			>
				<span class="fz-14 color-grey social-link">google.com </span>

				<div class="social-logo mr-2">
					<img src="@/assets/icons/facebook.svg" alt="" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import useBrowser from '@/composables/common/browser.js';

export default {
	name: 'CompanyInfo',
	props: {
		details: {
			type: Object,
			default: () => {},
		},
	},
	setup() {
		const { open } = useBrowser();

		const handleSocialClick = () => {
			open('https://google.com');
		};

		return {
			handleSocialClick,
		};
	},
};
</script>

<style scoped lang="scss">
.social-item {
	padding: 5px 0;
	border-bottom: 0.5px solid var(--ion-color-light-shade);
}

.social-link {
	color: var(--ion-color-grey);
	font-weight: 400;
}

.social-logo {
	width: 25px;
	height: 25px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
	}
}

.inst {
	width: 27px;
	height: 27px;
}

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
