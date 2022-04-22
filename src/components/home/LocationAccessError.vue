<template>
	<div class="color-danger fz-14 ion-text-center p-3 fw-500 bg-white rounded">
		<p>
			We can not match the best results for you. Please Enable your geolocation
			permission
		</p>

		<div class="ion-text-center mt-3">
			<Button class="px-5 enable-btn" color="danger" @click="openSettings">
				Enable
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings';

export default {
	name: 'LocationAccessError',
	components: {
		Button,
	},
	setup() {
		const openSettings = () => {
			OpenNativeSettings.open('location');
		};

		return {
			openSettings,
		};
	},
};
</script>

<style lang="scss" scoped>
.enable-btn {
	height: 30px;
}
</style>
