<template>
	<div class="is-flex ion-justify-content-between">
		<div>
			<p class="fz-14 fw-400 title">
				{{ title }}
			</p>
			<slot></slot>
		</div>

		<ion-button class="close-btn fz-14" @click="$emit('close')">
			<ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
		</ion-button>
	</div>
</template>

<script>
import { IonButton, IonIcon } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

export default {
	name: 'ModalHeader',
	components: {
		IonButton,
		IonIcon,
	},
	props: {
		title: {
			type: String,
			default: null,
		},
	},
	setup() {
		return {
			closeOutline,
		};
	},
};
</script>

<style lang="scss" scoped>
.close-btn {
	border-radius: 50%;
	overflow: hidden;
	--padding-start: 0;
	--padding-end: 0;
	--padding-top: 0;
	--padding-bottom: 0;
	--background: var(--white);
	--background-activated: var(--white);
	--background-focused: var(--white);
	height: 25px;
	width: 25px;
	color: var(--ion-text-color);
}

.title {
	color: var(--ion-text-color);
}
</style>
