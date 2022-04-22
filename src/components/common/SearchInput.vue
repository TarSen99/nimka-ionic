<template>
	<div
		class="relative is-flex is-justify-content-center"
		@click="handleContainerClick"
	>
		<ion-input
			type="text"
			class="search-input w-100"
			ref="inputRef"
			:value="modelValue"
			@ionInput="handleInput"
			@ionFocus="handleFocus"
			@ionBlur="handleBlur"
		/>
		<span
			v-show="!!modelValue"
			ref="remove"
			class="remove absolute"
			@click="handleClearClick"
		>
			<ion-icon :icon="closeOutline" class="close-icon"></ion-icon>
		</span>

		<div
			class="placeholder absolute w-100 is-flex"
			ref="placeholder"
			:class="{ hide: !showPlaceHolder || isFocused }"
		>
			<ion-icon :icon="searchOutline" class="vertical-middle mr-2"></ion-icon>
			<span class="vertical-middle"> Search </span>
		</div>
	</div>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
import { ref, toRefs } from '@vue/reactivity';
import { IonInput } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { watch } from '@vue/runtime-core';

export default {
	name: 'SearchInput',
	components: {
		IonIcon,
		IonInput,
	},
	props: {
		modelValue: {
			type: [Number, String],
			default: null,
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const { modelValue } = toRefs(props);
		const inputRef = ref(null);
		const placeholder = ref(null);
		let showPlaceHolder = ref(true);
		const isFocused = ref(false);

		watch(
			() => modelValue.value,
			(newValue) => {
				if (newValue) {
					showPlaceHolder.value = false;
					return;
				}

				showPlaceHolder.value = true;
			}
		);

		const handleContainerClick = () => {
			inputRef.value.$el.setFocus();
		};

		const handleFocus = () => {
			isFocused.value = true;
		};

		const handleBlur = () => {
			isFocused.value = false;
		};

		const handleInput = (e) => {
			const value = e.target.value;

			emit('update:modelValue', value);
		};

		const handleClearClick = () => {
			emit('update:modelValue', '');
			showPlaceHolder.value = true;
		};

		return {
			searchOutline,
			handleInput,
			handleContainerClick,
			inputRef,
			showPlaceHolder,
			placeholder,
			handleFocus,
			handleBlur,
			isFocused,
			closeOutline,
			handleClearClick,
		};
	},
};
</script>

<style lang="scss" scoped>
.search-input {
	outline: none;
	border-radius: 30px;
	border: none;
	background-color: rgba(255, 255, 255, 0.2);
	color: var(--ion-color-dark);
	font-weight: 400;
	font-size: 12px;
	height: 40px;
	padding: 0 10px;
	text-align: left;
	--padding-start: 20px;
}

.icon {
	--ionicon-stroke-width: 50px;
}

.remove {
	top: 50%;
	right: 15px;
	transform: translateY(-50%);
	z-index: 3;
	color: var(--ion-color-light);
	line-height: 10px !important;

	.close-icon {
		height: 20px;
		width: 20px;
	}
}

.placeholder {
	color: var(--white);
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	font-weight: 400;
	font-size: 14px;
	text-align: left;
	padding-left: 20px;
	transition: all 0.15s ease;
	z-index: 2;
	opacity: 1;

	&.hide {
		opacity: 0 !important;
	}
}
</style>
