<template>
	<div class="content relative">
		<div
			ref="filtersList"
			class="filters is-flex ion-align-items-center ion-justify-content-center"
		>
			<div class="filters-list is-flex">
				<div
					v-for="(filter, index) in filters"
					:key="index"
					class="filter-item is-flex is-flex-direction-column ion-align-items-center"
					:class="{ active: activeFilter === filter.id }"
					@click="handleClick(filter)"
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
	</div>
</template>

<script>
import { mapOutline, walletOutline, calendarOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import useHaptics from '@/composables/common/haptics.js';
import { ref } from '@vue/reactivity';

const FILTERS_LIST = [
	{
		title: 'By Date',
		icon: calendarOutline,
		id: 'date',
	},
	{
		title: 'By Distance',
		icon: mapOutline,
		id: 'distance',
	},
	{
		title: 'By Price',
		icon: walletOutline,
		id: 'price',
	},
];

export default {
	name: 'Filters',
	components: {
		IonIcon,
	},
	props: {
		activeFilter: {
			type: String,
			default: null,
		},
	},
	setup(_, { emit }) {
		const filters = FILTERS_LIST;
		const filtersList = ref(null);
		const { hapticsImpactLight } = useHaptics();

		const handleClick = (filter) => {
			emit('update-order', filter.id);
			hapticsImpactLight();
		};

		return {
			filters,
			filtersList,
			handleClick,
		};
	},
};
</script>

<style lang="scss" scoped>
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;
$white: var(--white);

.content {
	min-height: 200px;
	margin-top: -20px;
	height: 200px;
}

.filters {
	padding-bottom: 20px;
	height: 100%;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);

	&::before {
		position: absolute;
		left: 0;
		top: 0;
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background-image: url('./../../assets/icons/stars.svg');
		opacity: 0.6;
	}

	// background: linear-gradient(
	// 	180deg,
	// 	$gradientTopColor 0.39%,
	// 	$gradientBottomColor 70.34%
	// );
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
