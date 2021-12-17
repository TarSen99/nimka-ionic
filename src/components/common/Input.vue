<template>
	<ion-item class="input-container" lines="none" mode="ios">
		<ion-label v-if="label" position="stacked" mode="ios" class="label">{{
			label
		}}</ion-label>
		<ion-input
			mode="ios"
			class="input-el"
			:placeholder="placeholder"
			@ionInput="handleInput"
			@ionBlur="handleBlur"
			@ionFocus="$emit('focus')"
			@keydown="handleKeydown"
			@keyup="handleKeyUp"
			:value="modelValue"
			:type="type"
			:required="required"
			:class="{ danger: error }"
			:maxlength="maxlength"
			:max="max"
			:inputmode="inputmode"
			:pattern="pattern"
			ref="input"
		></ion-input>

		<p v-if="error" class="color-danger pt-1 fz-12">
			{{ error }}
		</p>
	</ion-item>
</template>

<script>
import { IonLabel, IonInput, IonItem } from '@ionic/vue';
import { ref } from '@vue/reactivity';

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
		error: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		inputmode: {
			type: String,
			default: null,
		},
		pattern: {
			type: String,
			default: null,
		},
		modelValue: {
			type: [String, Number],
			default: null,
		},
		maxlength: {
			type: [String, Number],
			default: null,
		},
		max: {
			type: Number,
			default: null,
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'blur', 'focus', 'keydown', 'keyup'],
	setup(props, { emit }) {
		let innerValue = ref('');

		const handleInput = (e) => {
			emit('update:modelValue', e.target.value);
			innerValue = e.target.value;

			setTimeout(() => {
				if (innerValue !== props.modelValue) {
					e.target.value = props.modelValue;
				}
			}, 0);
		};

		const handleBlur = () => {
			emit('blur');
		};

		const handleKeydown = (e) => {
			emit('keydown', e);
		};

		const handleKeyUp = (e) => {
			emit('keyup', e);
		};

		return {
			handleInput,
			handleBlur,
			handleKeydown,
			handleKeyUp,
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

.input-el {
	--background: var(--ion-color-light);
	border-radius: 30px;
	--placeholder-color: var(--ion-color-medium);
	--placeholder-opacity: 1;
}

::v-deep(.input-el) {
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
