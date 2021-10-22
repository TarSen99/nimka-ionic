<template>
	<ion-item class="input-container" lines="none" mode="ios">
		<ion-label v-if="label" position="stacked" mode="ios" class="label">{{
			label
		}}</ion-label>
		<ion-input
			mode="ios"
			class="input"
			:placeholder="placeholder"
			@ionInput="handleInput"
			:value="modelValue"
			:type="type"
			:required="required"
		></ion-input>
	</ion-item>
</template>

<script>
import { IonLabel, IonInput, IonItem } from '@ionic/vue';

export default {
	name: 'Input',
	components: {
		IonLabel,
		IonInput,
		IonItem,
	},
	props: {
		type: {
			type: String,
			default: 'text',
		},
		label: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		modelValue: {
			type: [String, Number],
			default: null,
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue'],
	setup(_, { emit }) {
		const handleInput = (e) => {
			emit('update:modelValue', e.target.value);
		};

		return {
			handleInput,
		};
	},
};
</script>

<style lang="scss" scoped>
.input-container {
	--background: none;
	--padding-start: 0;
	--padding-end: 0;
	--inner-padding-start: 0;
	--inner-padding-end: 0;
}

.input {
	--background: var(--ion-color-light);
	border-radius: 30px;
	--placeholder-color: var(--ion-color-medium);
	--placeholder-opacity: 1;
}

::v-deep(.input) {
	input {
		height: 50px;
		padding: 0 22px;
	}
}

.label {
	color: var(--ion-color-light);
	font-size: 18px !important;
	font-weight: 300;
}
</style>
