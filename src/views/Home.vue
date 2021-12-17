<template>
	<ion-page v-bind="$attrs" class="ion-page">
		<Menu />

		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
				>
					<ion-buttons>
						<ion-button
							@click="handleMenuClick"
							class="user-btn default-icon-btn"
							ref="accountButton"
						>
							<ion-icon slot="icon-only" :icon="personOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<SearchInput
						class="search-input-container"
						ref="searchInput"
					></SearchInput>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content
			:fullscreen="true"
			:scroll-events="true"
			@ionScroll="handleScroll($event)"
		>
			<ion-refresher
				slot="fixed"
				@ionRefresh="doRefresh($event)"
				:pullMin="120"
				:pullMax="200"
				pull-factor="0.5"
			>
				<ion-refresher-content
					class="refresher"
					refreshing-spinner="crescent"
				></ion-refresher-content>
			</ion-refresher>

			<div ref="pageContent" id="main">
				<Filters
					:active-filter="activeFilter"
					@update-filter="updateFilter"
					ref="topContent"
				/>

				<div class="ion-padding main-content relative" ref="mainContent">
					<div class="food-items pt-2">
						<transition name="fade-slide">
							<active-order
								v-if="hasActiveOrder"
								key="order"
								class="mb-5"
								@complete-order="hasActiveOrder = false"
							/>
						</transition>
						<FoodItem
							v-for="(item, index) in items"
							:key="item"
							class="mb-3"
							@click="$router.push(`/product/${index + 1}`)"
						/>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script>
import FoodItem from '@/components/home/FoodItem.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import Filters from '@/components/home/Filters.vue';
import useHeaderAnimation from '@/composables/home/useHeaderAnimation.js';
import ActiveOrder from '@/components/common/ActiveOrder.vue';

import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonIcon,
	IonButton,
	IonButtons,
	IonRefresher,
	IonRefresherContent,
} from '@ionic/vue';
import { computed, reactive, ref, toRefs } from '@vue/reactivity';
import { personOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import Menu from '@/components/common/Menu.vue';

export default {
	name: 'Home',
	components: {
		IonContent,
		IonHeader,
		IonPage,
		IonToolbar,
		FoodItem,
		IonButton,
		IonButtons,
		IonIcon,
		SearchInput,
		IonRefresher,
		IonRefresherContent,
		Filters,
		Menu,
		ActiveOrder,
	},
	setup() {
		const {
			pageContent,
			header,
			handleScroll,
			accountButton,
			searchInput,
			itemsList,
			topContent,
		} = useHeaderAnimation();
		const items = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
		const activeFilter = ref(0);
		const store = useStore();
		const mainContent = ref(null);
		const hasActiveOrder = ref(false);

		const menuisOpen = computed(() => store.state.menu.isOpen);

		const handleMenuClick = () => {
			store.commit('menu/handleMenu', !menuisOpen.value);
		};

		// const a = reactive({
		// 	test: 1,
		// });

		// const aAsRefs = toRefs(a);

		// const { test } = aAsRefs;

		// setTimeout(() => {
		// 	a.test = 3;
		// }, 1000);

		const doRefresh = (e) => {
			setTimeout(() => {
				console.log('Async operation has ended');
				e.target.complete();
			}, 1000);
		};

		const updateFilter = (v) => {
			activeFilter.value = v;
		};

		setTimeout(() => {
			hasActiveOrder.value = true;
		}, 3000);

		return {
			items,
			personOutline,
			doRefresh,
			activeFilter,
			updateFilter,
			pageContent,
			header,
			accountButton,
			handleScroll,
			searchInput,
			itemsList,
			handleMenuClick,
			topContent,
			mainContent,
			hasActiveOrder,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.header {
	&::after {
		display: none !important;
	}
}

.title {
	font-size: 16px;
	height: auto;
}

.placeholder {
	min-width: 30px;
	display: inline-block;
}

.user-btn {
	// --background: rgba(255, 255, 255, 0.2);
	// --color: var(--white);
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	color: #fff;
}

ion-content {
	--background: $gradientTopColor;
}

.ion-page {
	background-color: $gradientTopColor;
}

.search-input-container {
	width: 70%;
}

::v-deep(.refresher) {
	.refresher-refreshing {
		margin-top: 100px !important;
		--color: var(--white) !important;
		//  background-color: #f17e48 !important;
	}
}
</style>
