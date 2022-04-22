<template>
	<ion-item class="input-container" lines="none" mode="ios">
		<ion-label v-if="label" position="stacked" mode="ios" class="label">{{
			label
		}}</ion-label>
		<component
			:is="inputComponent"
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
			:class="{ danger: error, textarea }"
			:readonly="readonly"
			:maxlength="maxlength"
			:max="max"
			:inputmode="inputmode"
			:pattern="pattern"
			ref="input"
		></component>

		<transition name="slide-y">
			<p v-if="error" class="error color-danger pt-1 pl-2 fz-14">
				{{ error }}
			</p>
		</transition>
	</ion-item>
</template>

<script>
import { IonLabel, IonInput, IonItem, IonTextarea } from '@ionic/vue';
import { ref, toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';

export default {
	name: 'Input',
	components: {
		IonLabel,
		IonInput,
		IonItem,
		IonTextarea,
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
		readonly: {
			type: Boolean,
			default: false,
		},
		textarea: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'blur', 'focus', 'keydown', 'keyup'],
	setup(props, { emit }) {
		let innerValue = ref('');
		const { textarea } = toRefs(props);

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

		const inputComponent = computed(() => {
			if (textarea.value) {
				return 'textarea';
			}

			return 'ion-input';
		});

		return {
			handleInput,
			handleBlur,
			handleKeydown,
			handleKeyUp,
			inputComponent,
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

.textarea {
	padding: 10px 22px !important;
	height: auto;
	background: var(--grey);
	width: 100%;
	border: none;
	resize: none;
	height: 100px;
	outline: none;

	&::placeholder {
		color: var(--ion-color-medium);
	}
}

.label {
	color: var(--ion-color-light);
	font-size: 18px !important;
	font-weight: 300;
}
</style>
