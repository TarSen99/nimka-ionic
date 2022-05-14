<template>
	<ion-modal
		:is-open="modelValue"
		:swipe-to-close="true"
		css-class="customer-order-details-modal"
		mode="ios"
		@willDismiss="handleClose"
		@willPresent="handlePresent"
		:breakpoints="[0, 0.8, 0.9]"
		:initialBreakpoint="0.8"
	>
		<div class="ion-padding">
			<div class="pt-4">
				<p class="ion-text-center color-dark fz-18 fw-500">
					{{ t('home.filters.look') }}:
				</p>
				<div class="mt-5">
					<p class="ion-text-center fz-40 fw-600 color-primary">
						{{ radius
						}}<span class="fz-16 color-dark">{{ t('common.km') }} </span>
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
							<span class="color-medium fw-500 fz-14">
								1{{ t('common.km') }}
							</span>
						</ion-label>
						<ion-label slot="end">
							<span class="color-medium fw-500 fz-14">
								60{{ t('common.km') }}
							</span>
						</ion-label>
					</ion-range>
				</ion-item>
			</div>

			<div class="mt-5 filters">
				<div>
					<p class="fw-500 color-dark fz-14">
						{{ t('home.filters.es_type') }}:
					</p>

					<div class="filters-list is-flex mt-2">
						<div
							class="filter-item mr-2"
							:class="{ active: filters.type.includes('restaurant') }"
							@click="toggleFilter(filters.type, 'restaurant', 'type')"
						>
							{{ t('home.filters.restaurant') }}
						</div>

						<div
							class="filter-item mr-2"
							:class="{ active: filters.type.includes('store') }"
							@click="toggleFilter(filters.type, 'store', 'type')"
						>
							{{ t('home.filters.store') }}
						</div>
					</div>
				</div>

				<div>
					<p class="fw-500 color-dark fz-14 mt-5">
						{{ t('home.filters.pr_type') }}
					</p>

					<div class="filters-list is-flex mt-2">
						<div
							class="filter-item mr-2"
							:class="{ active: filters.product_type.includes('regular') }"
							@click="
								toggleFilter(filters.product_type, 'regular', 'product_type')
							"
						>
							{{ t('home.filters.regular') }}
						</div>

						<div
							class="filter-item mr-2"
							:class="{ active: filters.product_type.includes('niambox') }"
							@click="
								toggleFilter(filters.product_type, 'niambox', 'product_type')
							"
						>
							{{ t('home.filters.niambox') }}
						</div>
					</div>
				</div>

				<div>
					<p class="fw-500 color-dark fz-14 mt-5">
						{{ t('home.filters.availability') }}
					</p>

					<div class="filters-list is-flex mt-2">
						<div
							class="filter-item mr-2"
							:class="{ active: filters.status.includes('active') }"
							@click="toggleFilter(filters.status, 'active', 'status')"
						>
							{{ t('home.filters.relevant') }}
						</div>

						<div
							class="filter-item mr-2"
							:class="{ active: filters.status.includes('all') }"
							@click="toggleFilter(filters.status, 'all', 'status')"
						>
							{{ t('home.filters.all') }}
						</div>
					</div>
				</div>
			</div>

			<div class="toggle-container">
				<ion-item lines="none" class="item">
					<ion-label color="label">
						<span
							v-html="t('home.filters.notify')"
							class="fz-14 fw-500 color-dark"
						>
						</span
					></ion-label>
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
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SAVED_FILTERS } from '@/config/constants.js';

import { IonModal, IonRange, IonItem, IonLabel, IonToggle } from '@ionic/vue';
import { computed } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n/index';

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
		const filtersChanged = ref(false);
		const { t } = useI18n();

		const filters = computed(() => {
			return store.state.user.filters;
		});

		// const filters = reactive({
		// 	type: ['restaurant', 'store'],
		// 	product_type: ['regular', 'niambox'],
		// 	status: [''],
		// });

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
				emit('update:modelValue', {
					value: false,
					changed: false,
					filtersChanged: filtersChanged.value,
				});

				return;
			}

			emit('update:modelValue', {
				value: false,
				changed: true,
				filtersChanged: filtersChanged.value,
			});
		};

		const handlePresent = () => {
			saved.value = {
				...store.state.user.profileSettings,
			};
		};

		const toggleFilter = (filterItem, value, filterName) => {
			filtersChanged.value = true;
			Haptics.impact({ style: ImpactStyle.Light });

			const filterItemValue = [...filterItem];

			if (filterItemValue.includes(value)) {
				const index = filterItemValue.indexOf(value);
				filterItemValue.splice(index, 1);
				store.commit('user/updateFilters', {
					...filters.value,
					[filterName]: filterItemValue,
				});

				localStorage.setItem(SAVED_FILTERS, JSON.stringify(filters.value));
				return;
			}

			filterItemValue.push(value);

			store.commit('user/updateFilters', {
				...filters.value,
				[filterName]: filterItemValue,
			});

			localStorage.setItem(SAVED_FILTERS, JSON.stringify(filters.value));
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
			filters,
			toggleFilter,
			t,
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

.filters {
	padding: 0 20px;
}

.filter-item {
	border-radius: 30px;
	padding: 5px 15px;
	text-align: center;
	font-weight: 500;
	color: var(--ion-color-dark);
	border: 2px solid var(--ion-color-dark);
	background: var(--white);
	font-size: 14px;
	transition: all 0.2s ease;

	&.active {
		background: var(--ion-color-dark);
		color: var(--white);
	}
}
</style>
