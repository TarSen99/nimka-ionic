<template>
	<ion-modal
		:is-open="modelValue"
		:swipe-to-close="true"
		css-class="customer-order-details-modal"
		mode="ios"
		@willDismiss="handleClose"
		@willPresent="handlePresent"
		:breakpoints="[0, 0.6, 0.9]"
		:initialBreakpoint="0.6"
	>
		<div class="ion-padding">
			<div class="pt-4">
				<p class="ion-text-center color-dark fz-18 fw-500">
					Look for products within:
				</p>
				<div class="mt-5">
					<p class="ion-text-center fz-40 fw-600 color-primary">
						{{ radius }}<span class="fz-16 color-dark">Km </span>
					</p>
				</div>
				<ion-item
					lines="none"
					class="item"
					@touchstart="handleStartRange"
					@touchend="handleEndRange"
				>
					<ion-range
						min="1"
						max="60"
						color="primary"
						class="range"
						step="1"
						:value="radius"
						@ionChange="handleChange"
					>
						<ion-label slot="start">
							<span class="color-medium fw-500 fz-14"> 1km </span>
						</ion-label>
						<ion-label slot="end">
							<span class="color-medium fw-500 fz-14"> 60km </span>
						</ion-label>
					</ion-range>
				</ion-item>
			</div>

			<div class="toggle-container">
				<ion-item lines="none" class="item">
					<ion-label color="label">
						<span class="fz-14 fw-500 color-dark">
							Notify me about new products <br />
							in my area</span
						></ion-label
					>
					<ion-toggle
						mode="ios"
						:checked="receivePush === true"
						@ionChange="handlePushChange"
					>
					</ion-toggle>
				</ion-item>
			</div>
		</div>
	</ion-modal>
</template>

<script>
import { ref, toRefs } from '@vue/reactivity';
import { useStore } from 'vuex';
import { Haptics } from '@capacitor/haptics';

import { IonModal, IonRange, IonItem, IonLabel, IonToggle } from '@ionic/vue';
import { computed } from '@vue/runtime-core';

const equal = (a, b) => {
	let equal = true;

	for (let key in a) {
		if (a[key] !== b[key]) {
			equal = false;
		}
	}

	return equal;
};

export default {
	name: 'SettingsModal',
	components: {
		IonModal,
		IonRange,
		IonItem,
		IonLabel,
		IonToggle,
	},
	props: {
		modelValue: {
			type: Boolean,
			default: null,
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const store = useStore();
		const saved = ref({});

		const hapticsSelectionStart = async () => {
			await Haptics.selectionStart();
		};

		const hapticsSelectionChanged = async () => {
			await Haptics.selectionChanged();
		};

		const hapticsSelectionEnd = async () => {
			await Haptics.selectionEnd();
		};

		const radius = computed(() => {
			return store.state.user.profileSettings.searchRadius;
		});

		const receivePush = computed(() => {
			return store.state.user.profileSettings.sendNewProductNotifications;
		});

		const handleStartRange = () => {
			hapticsSelectionStart();
		};

		const handleEndRange = () => {
			hapticsSelectionEnd();
		};

		const handleChange = (e) => {
			hapticsSelectionChanged();
			store.commit('user/updateSettings', {
				...store.state.user.profileSettings,
				searchRadius: e.target.value,
			});
		};

		const handlePushChange = () => {
			store.commit('user/updateSettings', {
				...store.state.user.profileSettings,
				sendNewProductNotifications: !receivePush.value,
			});
		};

		const handleClose = () => {
			const equalObj = equal(store.state.user.profileSettings, saved.value);

			if (!equalObj) {
				store.dispatch('user/updateUserSettings');
			}

			const equalRadius =
				store.state.user.profileSettings.searchRadius ===
				saved.value.searchRadius;

			if (equalRadius) {
				emit('update:modelValue', { value: false, changed: false });

				return;
			}

			emit('update:modelValue', { value: false, changed: true });
		};

		const handlePresent = () => {
			saved.value = {
				...store.state.user.profileSettings,
			};
		};

		return {
			radius,
			handleChange,
			handlePushChange,
			receivePush,
			handleClose,
			handlePresent,
			handleStartRange,
			handleEndRange,
		};
	},
};
</script>

<style lang="scss" scoped>
.range {
	--bar-height: 10px;
	padding-top: 0 !important;

	&::part(bar),
	&::part(bar-active) {
		border-radius: 5px !important;
	}
}

.label {
	white-space: initial;
}

.toggle-container {
	margin-top: 20px;
}

.item {
	--background: var(--ion-color-color-light) !important;
	&::part(native) {
		--background: var(--ion-color-color-light);
	}
}
</style>
