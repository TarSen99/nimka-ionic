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

					<ion-title class="ion-text-center"> My products </ion-title>

					<span class="placeholder"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<view-product-modal
				:is-open="showProductModal"
				@close="showProductModal = false"
			/>

			<div class="ion-padding">
				<ProductItem
					v-for="item in orders"
					:key="item.id"
					:status="item.status"
					class="mb-3"
					title="Tasty burger"
					subtitle="My company"
					@click="showProductModal = true"
				/>
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
import ProductItem from '@/components/admin/ProductItem.vue';
import ViewProductModal from '@/components/admin/ViewProductModal.vue';

export default {
	name: 'My products',
	components: {
		IonPage,
		IonHeader,
		IonContent,
		IonToolbar,
		IonButton,
		IonButtons,
		IonTitle,
		IonIcon,
		ViewProductModal,
		ProductItem,
	},
	setup() {
		const orders = ref([
			{
				status: 'active',
				id: 1,
			},
			{
				status: 'unpublished',
				id: 2,
			},
			{
				status: 'finished',
				id: 3,
			},
		]);
		const showProductModal = ref(false);

		return {
			orders,
			chevronBackOutline,
			showProductModal,
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
