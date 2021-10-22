<template>
	<IonButton mode="ios" v-bind="props" class="button" @click="$emit('click')">
		<slot></slot>
	</IonButton>
</template>

<script>
import { IonButton } from '@ionic/vue';

export default {
	components: {
		IonButton,
	},
	emits: ['click'],
	setup(props) {
		return {
			props,
		};
	},
};
</script>

<style lang="scss" scoped>
.button {
	--border-radius: 30px;
	margin-left: 0;
	margin-right: 0;
}
</style>
