<template>
	<div>
		<ion-item lines="none" class="w-100 mr-3 select-item">
			<ion-label position="stacked" mode="ios" class="label">
				<p class="label">{{ label }}</p>
			</ion-label>
			<ion-select
				:placeholder="placeholder"
				interface="popover"
				class="select"
				:value="modelValue"
				@ionChange="handleChange"
				mode="ios"
			>
				<ion-select-option
					v-for="(option, index) in options"
					:value="option.value"
					:key="index"
					>{{ option.name }}</ion-select-option
				>
			</ion-select>
		</ion-item>
		<transition name="slide-y">
			<p v-if="error" class="error color-danger pt-1 pl-2 fz-14">
				{{ error }}
			</p>
		</transition>
	</div>
</template>

<script>
import { IonSelect, IonSelectOption, IonLabel, IonItem } from '@ionic/vue';

export default {
	name: 'Select',
	components: {
		IonSelect,
		IonSelectOption,
		IonLabel,
		IonItem,
	},
	props: {
		label: {
			type: String,
			default: null,
		},
		error: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		modelValue: {
			type: [Number, String],
			default: null,
		},
		options: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update:modelValue'],
	setup(_, { emit }) {
		const handleChange = (e) => {
			emit('update:modelValue', e.target.value);
		};

		return {
			handleChange,
		};
	},
};
</script>

<style scoped lang="scss">
.select {
	--background: var(--white);
	background: var(--white);
	border-radius: 10px !important;
	border: 1px solid var(--ion-color-light-shade) !important;
	height: 50px;

	&::part(placeholder),
	&::part(text) {
		padding-left: 22px;
	}
}

.select-item {
	--padding-start: 0;
	--padding-end: 0;
	--inner-padding-start: 0;
	--inner-padding-end: 0;
}

.label {
	color: var(--dark-grey);
	font-size: 14px !important;
	font-weight: 400;
}
</style>
