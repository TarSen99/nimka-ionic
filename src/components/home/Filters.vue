<template>
	<div
		class="filters is-flex ion-align-items-center ion-justify-content-center"
	>
		<div class="filters-list is-flex">
			<div
				v-for="(filter, index) in filters"
				:key="index"
				class="filter-item is-flex is-flex-direction-column ion-align-items-center"
				:class="{ active: activeFilter === filter.id }"
				@click="$emit('update-filter', filter.id)"
			>
				<div
					class="filter-icon is-flex ion-align-items-center ion-justify-content-center"
				>
					<ion-icon :icon="filter.icon"></ion-icon>
				</div>

				<p class="ion-text-center mt-3 filter-title fz-14 fw-500">
					{{ filter.title }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapOutline, walletOutline, calendarOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';

const FILTERS_LIST = [
	{
		title: 'By Date',
		icon: calendarOutline,
		id: 0,
	},
	{
		title: 'By Distance',
		icon: mapOutline,
		id: 1,
	},
	{
		title: 'By Price',
		icon: walletOutline,
		id: 2,
	},
];

export default {
	name: 'Filters',
	components: {
		IonIcon,
	},
	props: {
		activeFilter: {
			type: Number,
			default: null,
		},
	},
	setup() {
		const filters = FILTERS_LIST;

		return {
			filters,
		};
	},
};
</script>

<style lang="scss" scoped>
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;
$white: var(--white);

.filters {
	min-height: 200px;
	margin-top: -20px;
	padding-bottom: 20px;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);
}

.filters-list {
	color: var(--ion-color-dark);
}

.filter-icon {
	height: 40px;
	width: 40px;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 50%;
    transition: background-color 0.2s;
    position: relative;

    &::before {
        position: absolute;
        content: '';
        display: block;
        top: 50%;
        left: 50%;
        width: 35px;
        height: 35px;
        transition: all 0.2s;
        background-color: var(--white);
        opacity: 0.4;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }
}

.filter-item {
	margin-right: 25px;

	&:last-child {
		margin-right: 0;
	}
}

.filter-title {
	color: var(--white);
	opacity: 0.8;
    transition: opacity 0.2s;
}

.active {
	.filter-title {
		opacity: 1;
	}

	.filter-icon {
		background-color: var(--white);

        &::before { 
            width: 56px;
            height: 56px;
        }
	}
}
</style>
