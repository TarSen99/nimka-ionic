<template>
	<div>
		<ion-menu
			@ionDidClose="handleClose"
			side="start"
			content-id="main"
			type="overlay"
			mode="md"
			:swipe-gesture="false"
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
							{{ userDetails.name || 'No name' }}
						</h2>
					</div>

					<ion-list class="mt-5">
						<ion-item
							v-for="(item, index) in menuItems"
							:key="index"
							class="menu-item"
							lines="none"
							@click="runHandler(item.handler, $router)"
							:class="{
								danger: item.danger,
								[`color-${item.color}`]: item.color,
							}"
						>
							<ion-icon
								:icon="item.icon"
								class="fz-20 mr-5 icon"
								:class="{
									[`color-${item.color}`]: item.color,
									'color-dark': !item.color,
								}"
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
	locateOutline,
	bagOutline,
	addOutline,
	logOutOutline,
	lockOpenOutline,
	basketOutline,
	fastFoodOutline,
} from 'ionicons/icons';
import { signOut } from '@/services/firebase/auth.js';
import { clearLs } from '@/helpers/index.js';
import { ROLES } from '@/config/constants.js';
import realtime from '@/services/firebase/db.js';
import i18n from '@/i18n.js';

const { t } = i18n.global;

const MENU_ITEMS = [
	{
		title: t('menu.post'),
		roles: [ROLES.OWNER, ROLES.EMPLOYEE, ROLES.MANAGER],
		icon: addOutline,
		danger: true,
		handler: (router) => {
			router.push('/new-product');
		},
	},
	{
		title: t('menu.my_products'),
		roles: [ROLES.OWNER, ROLES.EMPLOYEE, ROLES.MANAGER],
		icon: fastFoodOutline,
		handler: (router) => {
			router.push('/my-products');
		},
	},
	{
		title: t('menu.account'),
		icon: personOutline,
		roles: ['customer'],
		handler: (router) => {
			router.push('/account');
		},
	},
	{
		title: t('menu.address'),
		icon: locateOutline,
		roles: ['customer'],
		handler: (router) => {
			router.push('/address');
		},
	},
	{
		title: t('menu.my_orders'),
		icon: bagOutline,
		roles: ['customer'],
		handler: (router) => {
			router.push('/orders');
		},
	},
	{
		title: t('menu.incoming'),
		roles: [ROLES.OWNER, ROLES.EMPLOYEE, ROLES.MANAGER],
		icon: basketOutline,
		handler: (router) => {
			router.push('/incoming-orders');
		},
	},
	{
		title: t('menu.change_pass'),
		icon: lockOpenOutline,
		roles: [ROLES.OWNER, ROLES.EMPLOYEE, ROLES.MANAGER],
		handler: (router) => {
			router.push('/password/change');
		},
	},
	{
		title: t('menu.logout'),
		roles: ['customer', 'employee', 'owner', 'manager'],
		icon: logOutOutline,
		color: 'danger',
		handler: (router) => {
			signOut();
			clearLs();
			realtime.disconnect();

			// store.dispatch('company/updateRole', null);
			// store.dispatch('company/updateId', null);

			router.replace('/phone-register');
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
		const menuItems = ref([]);
		const role = computed(() => {
			return store.state.user.role;
		});

		const filterItems = () => {
			menuItems.value = MENU_ITEMS.filter((item) => {
				return item.roles.find((cr) => cr === role.value);
			});
		};

		watch(isOpen, () => {
			if (isOpen.value) {
				menuController.open();
			} else {
				menuController.close();
			}
		});

		watch(
			() => role.value,
			() => {
				filterItems();
			},
			{
				immediate: true,
				deep: true,
			}
		);

		const handleClose = () => {
			store.commit('menu/handleMenu', false);
		};

		const runHandler = (handler, router) => {
			menuController.close();
			handler(router);
		};

		const userDetails = computed(() => {
			return store.state.user.details;
		});

		return {
			isOpen,
			handleClose,
			personCircleOutline,
			menuItems,
			runHandler,
			userDetails,
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

.danger {
	--background: linear-gradient(
		180deg,
		#f17e48 0.39%,
		#ec5230 70.34%
	) !important;
	color: var(--white) !important;
	font-weight: 600;

	.icon {
		color: var(--white) !important;
		--ionicon-stroke-width: 60px;
	}
}
</style>
