<template>
	<div class="color-danger fz-14 ion-text-center p-3 fw-500 bg-white rounded">
		<p>Please allow your geolocation to match the best results for you</p>

		<div class="ion-text-center mt-3">
			<Button class="px-5 enable-btn" color="danger" @click="allow">
				Allow
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import useGeolocation from '@/composables/common/geoLocation.js';
import useLoader from '@/composables/common/useLoader.js';
import useSaveLocation from '@/composables/auth/saveLocation.js';

export default {
	name: 'LocationAccessError',
	components: {
		Button,
	},
	emits: ['update-list', 'denied'],
	setup(_, { emit }) {
		const { getCurrentLocation } = useGeolocation();
		const { showLoader, hideLoader } = useLoader();
		const { updateAddress } = useSaveLocation();

		const allow = async () => {
			await showLoader();
			getCurrentLocation(true).then(async (res) => {
				if (!res) {
					emit('denied');
					hideLoader();

					return;
				}

				await updateAddress(res);

				hideLoader();
				emit('update-list');
			});
		};

		return {
			allow,
		};
	},
};
</script>

<style lang="scss" scoped>
.enable-btn {
	height: 30px;
}
</style>
