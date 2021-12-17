<template>
	<div
		class="relative is-flex is-justify-content-center"
		@click="handleContainerClick"
	>
		<input
			type="text"
			class="search-input w-100"
			@input="handleInput"
			ref="inputRef"
			:value="search"
		/>

		<div
			class="placeholder absolute w-100 is-flex ion-justify-content-center"
			ref="placeholder"
			:class="{ hide: !showPlaceHolder }"
		>
			<ion-icon :icon="searchOutline" class="vertical-middle mr-2"></ion-icon>
			<span class="vertical-middle">
				Search for restaurant
			</span>
		</div>
	</div>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
import { ref } from '@vue/reactivity';

export default {
	name: 'SearchInput',
	components: {
		IonIcon,
	},
	setup(props, { emit }) {
		const search = ref('');
		const inputRef = ref(null);
		const placeholder = ref(null);
		let showPlaceHolder = ref(true);

		const handleContainerClick = () => {
			inputRef.value.focus();
		};

		const handleInput = (e) => {
			const value = e.target.value;
			search.value = value;

			emit('search', search.value);

			if (value) {
				showPlaceHolder.value = false;
				return;
			}

			showPlaceHolder.value = true;
		};

		return {
			searchOutline,
			handleInput,
			search,
			handleContainerClick,
			inputRef,
			showPlaceHolder,
			placeholder,
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
	text-align: center;
}

.placeholder {
	color: var(--white);
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	font-weight: 400;
	font-size: 14px;

	&.hide {
		display: none !important;
	}
}
</style>
