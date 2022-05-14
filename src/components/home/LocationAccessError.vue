<template>
	<div class="color-danger fz-14 ion-text-center p-3 fw-500 bg-white rounded">
		<p>
			{{ t('home.location.denied') }}
		</p>

		<div class="ion-text-center mt-3">
			<Button class="px-5 enable-btn" color="danger" @click="openSettings">
				{{ t('home.location.enable') }}
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'LocationAccessError',
	components: {
		Button,
	},
	setup() {
		const { t } = useI18n();

		const openSettings = () => {
			OpenNativeSettings.open('location');
		};

		return {
			openSettings,
			t,
		};
	},
};
</script>

<style lang="scss" scoped>
.enable-btn {
	height: 30px;
}
</style>
