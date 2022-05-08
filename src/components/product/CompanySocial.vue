<template>
	<div>
		<div
			v-if="details && details.instagram"
			class="social-item is-flex ion-align-items-center ion-justify-content-between mb-2"
			:class="{ lines }"
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
</template>

<script>
import useBrowser from '@/composables/common/browser.js';

export default {
	name: 'CompanySocial',
	props: {
		details: {
			type: Object,
			default: () => {},
		},
		lines: {
			type: Boolean,
			default: true,
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
}

.lines {
	.social-item {
		border-bottom: 0.5px solid var(--ion-color-light-shade);
	}
}

.social-link {
	color: var(--ion-color-medium-shade);
	width: 85%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
</style>
