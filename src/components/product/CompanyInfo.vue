<template>
	<div>
		<div
			class="company-info p-3 is-flex ion-align-items-center"
			@click="$router.push(`/companies/${details.id}`)"
		>
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
				v-if="details && details.instagram"
				class="social-item is-flex ion-align-items-center ion-justify-content-between mb-2"
				@click="handleSocialClick(details.instagram)"
			>
				<span class="fz-14 color-grey social-link">
					{{ details && details.instagram }}
				</span>

				<div class="social-logo inst mr-2">
					<img src="@/assets/icons/instagram.svg" alt="" />
				</div>
			</div>

			<div
				v-if="details && details.facebook"
				class="social-item is-flex ion-align-items-center ion-justify-content-between"
				@click="handleSocialClick(details.facebook)"
			>
				<span class="fz-14 color-grey social-link"
					>{{ details && details.facebook }}
				</span>

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

		const handleSocialClick = (link) => {
			if (!link) {
				return;
			}

			let build = '';

			if (!link.includes('http')) {
				build = 'https://' + link;
			} else {
				build = link;
			}

			open(build);
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
	width: 20px;
	height: 20px;
	border-radius: 50%;
	overflow: hidden;

	img {
		width: 100%;
	}
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
