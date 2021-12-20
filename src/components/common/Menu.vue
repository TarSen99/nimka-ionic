<template>
	<div>
		<ion-menu
			@ionDidClose="handleClose"
			side="end"
			content-id="main"
			type="overlay"
			mode="md"
		>
			<!-- <ion-header>
				<ion-toolbar color="danger">
					<ion-title>End Menu</ion-title>
				</ion-toolbar>
			</ion-header> -->
			<ion-content class="content">
				<div class="top is-flex ion-align-items-center ion-padding-start"></div>

				<div class="main-menu-content">
					<div
						class="user-icon bg-light color-primary is-flex ion-align-items-center ion-justify-content-center"
					>
						<ion-icon :icon="personCircleOutline" class="fz-30"></ion-icon>
					</div>

					<div>
						<h2 class="fz-18 ml-4 fw-600">
							Username
						</h2>
					</div>

					<ion-list class="mt-5">
						<ion-item
							v-for="(item, index) in menuItems"
							:key="index"
							class="menu-item"
							lines="none"
							@click="item.handler($router)"
						>
							<ion-icon
								:icon="item.icon"
								class="fz-20 mr-5 color-dark"
							></ion-icon>

							<span class="fw-500"> {{ item.title }}</span></ion-item
						>
					</ion-list>
				</div>
			</ion-content>
		</ion-menu>
	</div>
</template>

<script>
import {
	IonHeader,
	IonItem,
	IonMenu,
	IonTitle,
	IonToolbar,
	menuController,
	IonContent,
	IonList,
	IonIcon,
} from '@ionic/vue';
import { useStore } from 'vuex';
import { computed, ref, watch } from '@vue/runtime-core';
import {
	personCircleOutline,
	personOutline,
	cardOutline,
	locateOutline,
	bagOutline,
} from 'ionicons/icons';

const MENU_ITEMS = [
	{
		title: 'Account',
		icon: personOutline,
		handler: (router) => {
			router.push('/account');
		},
	},
	// {
	// 	title: 'Card',
	// 	icon: cardOutline,
	// 	handler: (router) => {
	// 		router.push('/account');
	// 	},
	// },
	{
		title: 'Address',
		icon: locateOutline,
		handler: (router) => {
			router.push('/address');
		},
	},
	{
		title: 'My orders',
		icon: bagOutline,
		handler: (router) => {
			router.push('/orders');
		},
	},
	{
		title: 'Incoming orders',
		icon: bagOutline,
		handler: (router) => {
			router.push('/incoming-orders');
		},
	},
];

export default {
	name: 'Menu',
	components: {
		IonHeader,
		IonItem,
		IonMenu,
		IonTitle,
		IonToolbar,
		IonContent,
		IonList,
		IonIcon,
	},
	setup() {
		const store = useStore();
		const isOpen = computed(() => store.state.menu.isOpen);
		const menuItems = ref(MENU_ITEMS);

		watch(isOpen, () => {
			if (isOpen.value) {
				menuController.open();
			} else {
				menuController.close();
			}
		});

		const handleClose = () => {
			store.commit('menu/handleMenu', false);
		};

		return {
			isOpen,
			handleClose,
			personCircleOutline,
			menuItems,
		};
	},
};
</script>

<style lang="scss" scoped>
.top {
	background: linear-gradient(180deg, #f17e48 0.39%, #ec5230 70.34%);
	min-height: calc(60px + var(--ion-safe-area-top));
	background-repeat: repeat;
	position: relative;
	z-index: 2;

	&::before {
		position: absolute;
		display: block;
		content: '';
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-image: url('./../../assets/icons/stars.svg');
	}
}

.user-icon {
	border-radius: 50%;
	width: 50px;
	height: 50px;
	transform: translateY(calc(-50% - 10px));
	z-index: 3;
	position: absolute;
	top: 0;
	left: 0.8rem;
}

.menu-item {
	--padding-start: 0.8rem;
	--background: var(--white);
	border-bottom: 1px solid var(--ion-color-light);
}

.content {
	--background: var(--white);
}

.main-menu-content {
	padding-top: 20px;
	position: relative;
	&::before {
		width: 100%;
		height: 20px;
		content: '';
		display: block;
		position: absolute;
		left: 0;
		top: -10px;
		background: var(--white);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		z-index: 2;
	}
}

ion-list {
	padding: 0;
}
</style>
