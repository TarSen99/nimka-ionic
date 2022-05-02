<template>
	<div class="is-flex">
		<ion-item
			v-for="(item, index) in 10"
			:key="index"
			color="item"
			class="mb-3 placeholder-item"
			lines="none"
		>
			<ion-thumbnail slot="start" class="logo">
				<ion-skeleton-text animated></ion-skeleton-text>
			</ion-thumbnail>
			<ion-label class="h-100 pt-2 is-flex is-flex-direction-column pb-5">
				<div>
					<p class="pt-1">
						<ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
					</p>
				</div>
				<p class="pt-2">
					<ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
				</p>
			</ion-label>
		</ion-item>
	</div>
</template>

<script>
import { IonItem, IonLabel, IonSkeletonText, IonThumbnail } from '@ionic/vue';

export default {
	name: 'RawPlaceholder',
	components: {
		IonItem,
		IonLabel,
		IonSkeletonText,
		IonThumbnail,
	},
};
</script>

<style scoped lang="scss">
.placeholder-item {
	width: 300px;
	min-width: 300px;
	--padding-start: 0;
	padding: 4px;

	.logo {
		width: 150px;
		height: 150px;
		border-radius: 10px;
		overflow: hidden;
	}
}
</style>
