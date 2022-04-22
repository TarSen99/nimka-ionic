<template>
	<div
		class="absolute out-badge out-badge-container is-flex is-flex-direction-column w-100 ion-justify-content-between ion-align-items-start"
	>
		<Badge :color="color" class="px-3 mr-2 fz-14">
			<span> {{ text }} </span>
		</Badge>

		<div class="is-flex ion-justify-content-end w-100">
			<span
				class="fz-26 emodji is-flex ion-align-items-center ion-justify-content-center"
			>
				{{ emodji }}</span
			>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/common/Badge.vue';

export default {
	name: 'EmodjiStatus',
	components: {
		Badge,
	},
	props: {
		emodji: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: 'primary',
		},
	},
};
</script>

<style scoped lang="scss">
.out-badge-container {
	width: 140px;
	min-width: 140px;
	height: 140px;
}

.out-badge {
	z-index: 3;
	top: 10px;
	left: 10px;
}

.emodji {
	background: var(--white);
	padding: 5px;
	border-radius: 50%;
	width: 35px;
	height: 35px;
}
</style>
