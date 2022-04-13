<template>
	<ion-page>
		<ion-content>
			<div
				class="is-flex ion-align-items-center ion-justify-content-center ion-padding h-100 is-flex-direction-column"
			>
				<div class="ion-text-center">
					<ion-icon
						:icon="checkmarkOutline"
						class="icon"
						color="success"
					></ion-icon>
				</div>
				<h2 class="ion-text-center color-success">Success</h2>
				<p class="ion-text-center fz-16 fw-500 mt-3">
					<span>
						Product was successfully published. <br />
						Now users can see it from home screen
					</span>
				</p>

				<ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
					<div class="w-100 ion-padding">
						<Button class="mt-5" expand="block" @click="$router.replace('/')">
							Home
						</Button>
					</div>
				</ion-fab>
			</div>
		</ion-content>
	</ion-page>
</template>

<script>
import { IonContent, IonPage, IonIcon, IonFab } from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';

import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import { ref } from '@vue/reactivity';

export default {
	name: 'CheckoutSuccess',
	components: {
		IonPage,
		IonContent,
		IonIcon,
		Button,
		Badge,
		IonFab,
	},
	setup() {
		const title = ref(null);

		return {
			checkmarkOutline,
			title,
		};
	},
};
</script>

<style scoped lang="scss">
.icon {
	font-size: 80px;
}
</style>
