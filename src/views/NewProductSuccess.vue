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
				<h2 class="ion-text-center color-success">{{ t('common.success') }}</h2>
				<p class="ion-text-center fz-16 fw-500 mt-3">
					<span> {{ text }}. <br /> </span>
				</p>

				<ion-fab vertical="bottom" horizontal="left" slot="fixed" class="w-100">
					<div class="w-100 ion-padding">
						<Button
							class="mt-5"
							expand="block"
							@click="$router.replace(`/product/${$route.params.id}`)"
						>
							{{ t('new_product.view') }}
						</Button>

						<Button
							class="mt-2"
							expand="block"
							@click="$router.replace('/')"
							color="light"
						>
							{{ t('checkout.home') }}
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
import { useRoute } from 'vue-router';
import { computed } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n/index';

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
		const route = useRoute();
		const { t } = useI18n();

		const text = computed(() => {
			if (route.query.updated) {
				return t('new_product.updated');
			}

			return t('new_product.published');
		});

		return {
			checkmarkOutline,
			title,
			text,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
.icon {
	font-size: 80px;
}
</style>
