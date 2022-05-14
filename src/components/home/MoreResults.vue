<template>
	<div class="fz-14">
		<p class="ion-text-center color-grey italic">
			{{ t('home.more_results.to_see') }}
		</p>
		<p class="ion-text-center fw-600">
			<Button class="clear fz-14" @click="$emit('clear')">
				{{ t('home.more_results.clear') }}
			</Button>
		</p>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'MoreResults',
	components: {
		Button,
	},
	setup() {
		const { t } = useI18n();

		return {
			t,
		};
	},
};
</script>

<style scoped lang="scss">
.clear {
	height: 30px;
}
</style>
