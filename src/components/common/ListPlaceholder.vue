<template>
	<div>
		<ion-item
			v-for="(item, index) in items"
			:key="index"
			color="item"
			class="mb-3"
			lines="none"
		>
			<ion-thumbnail slot="start" class="logo">
				<ion-skeleton-text animated></ion-skeleton-text>
			</ion-thumbnail>
			<ion-label
				class="h-100 pt-2 is-flex is-flex-direction-column ion-justify-content-between pb-5"
			>
				<div>
					<h3>
						<ion-skeleton-text
							animated
							style="width: 100%"
							class="title"
						></ion-skeleton-text>
					</h3>
					<p class="pt-1">
						<ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
					</p>
				</div>
				<p>
					<ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
				</p>
			</ion-label>
		</ion-item>
	</div>
</template>

<script>
import {
	IonAvatar,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonSkeletonText,
	IonThumbnail,
} from '@ionic/vue';

export default {
	name: 'ListPlaceHolder',
	components: {
		IonAvatar,
		IonIcon,
		IonItem,
		IonLabel,
		IonList,
		IonListHeader,
		IonSkeletonText,
		IonThumbnail,
	},
	setup() {
		const items = [1, 1, 1, 1, 1, 1, 1, 1];

		return {
			items,
		};
	},
};
</script>

<style lang="scss" scoped>
.logo {
	width: 150px;
	height: 150px;
	border-radius: 10px;
	overflow: hidden;
}

.item {
	--padding-start: 5px;
}

.title {
	height: 20px;
}
</style>
