<template>
	<ion-page>
		<ion-header class="header" mode="md">
			<ion-toolbar class="toolbar" mode="md" ref="header" color="primary">
				<div
					class="is-flex ion-align-items-center ion-justify-content-between px-4"
				>
					<ion-buttons>
						<ion-button
							class="back-btn default-icon-btn"
							ref="backButton"
							@click.prevent="$router.back()"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<ion-title class="ion-text-center"> Incoming orders </ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<order-details-modal
				:is-open="showOrderDetails"
				@close="showOrderDetails = false"
			/>

			<div class="ion-padding">
				<!-- <FoodItem
					v-for="item in orders"
					:key="item"
					class="mb-3"
					done
					title="#3456 Tasty burger"
					subtitle="from Taras Seniv"
					@click="showOrderDetails = true"
				/> -->
			</div>
		</ion-content>
	</ion-page>
</template>

<script>
import {
	IonContent,
	IonHeader,
	IonPage,
	IonToolbar,
	IonButton,
	IonButtons,
	IonTitle,
	IonIcon,
} from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { ref } from '@vue/reactivity';
import FoodItem from '@/components/home/FoodItem.vue';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal.vue';

export default {
	name: 'Orders',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		FoodItem,
		OrderDetailsModal,
	},
	setup() {
		const orders = ref([1, 2, 3, 4, 5, 6]);
		const showOrderDetails = ref(false);

		return {
			orders,
			chevronBackOutline,
			showOrderDetails,
		};
	},
};
</script>

<style lang="scss" scoped>
.placeholder {
	min-width: 30px;
	display: inline-block;
}

::v-deep(.account-input) {
	.input-el {
		--background: var(--white);
	}

	.label {
		color: var(--dark-grey);
		font-size: 14px !important;
	}
}

.save {
	margin-top: 50px;
}
</style>
