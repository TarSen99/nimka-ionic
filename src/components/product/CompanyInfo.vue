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
				<p class="fz-12 color-light">Click to see more details</p>
			</div>
		</div>

		<div class="mt-2 pl-3">
			<company-social :details="details" />
		</div>
	</div>
</template>

<script>
import CompanySocial from '@/components/product/CompanySocial.vue';

export default {
	name: 'CompanyInfo',
	components: {
		CompanySocial,
	},
	props: {
		details: {
			type: Object,
			default: () => {},
		},
	},
	setup() {},
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
