<template>
	<div class="fz-14">
		<p class="ion-text-center color-grey italic">To see more results</p>
		<p class="ion-text-center fw-600">
			<Button class="clear fz-14" @click="$emit('clear')">
				Clear search
			</Button>
		</p>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
export default {
	name: 'MoreResults',
	components: {
		Button,
	},
};
</script>

<style scoped lang="scss">
.clear {
	height: 30px;
}
</style>
