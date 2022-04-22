<template>
	<div>
		<transition name="fade-slide">
			<location-access-error
				v-if="showDeniedPopup"
				key="location"
				class="mb-5"
			/>
		</transition>

		<transition name="fade-slide">
			<location-not-allowed
				v-if="showNotAllowedPopup"
				key="location_not_allowed"
				class="mb-5"
				@update="$emit('update-list')"
				@denied="handleDenied"
			/>
		</transition>
	</div>
</template>

<script>
import LocationAccessError from '@/components/home/LocationAccessError.vue';
import LocationNotAllowed from '@/components/home/LocationNotAllowed.vue';
import { computed, onMounted, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import useGeolocation from '@/composables/common/geoLocation.js';

export default {
	name: 'LocationAccess',
	components: {
		LocationAccessError,
		LocationNotAllowed,
	},
	emits: ['update-list'],
	setup() {
		const store = useStore();
		const { getDeniedValue, getNotAllowedValue } = useGeolocation();

		const deniedLocation = ref(false);
		const notAllowedLocation = ref(false);

		const hasHardcodedAddress = computed(() => {
			return !!store.state.user.details.latitude;
		});

		const showDeniedPopup = computed(() => {
			if (!Object.keys(store.state.user.details).length) {
				return false;
			}

			return deniedLocation.value && !hasHardcodedAddress.value;
		});

		const showNotAllowedPopup = computed(() => {
			if (!Object.keys(store.state.user.details).length) {
				return false;
			}

			return (
				notAllowedLocation.value &&
				!hasHardcodedAddress.value &&
				!showDeniedPopup.value
			);
		});

		const handleDenied = () => {
			deniedLocation.value = true;
		};

		onMounted(async () => {
			deniedLocation.value = await getDeniedValue();
			notAllowedLocation.value = await getNotAllowedValue();
		});

		return {
			showDeniedPopup,
			showNotAllowedPopup,
			notAllowedLocation,
			hasHardcodedAddress,
			deniedLocation,
			handleDenied,
		};
	},
};
</script>
