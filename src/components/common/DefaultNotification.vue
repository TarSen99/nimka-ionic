<template>
	<div class="default-notification rounded ion-padding">
		<p class="fw-500 title">
			{{ title }} <span class="color-primary fw-700">{{ colorTitle }}</span>
		</p>
		<p class="fw-400 subtitle fz-14 mt-1">
			{{ subtitle }}
		</p>

		<div v-if="actions.length" class="mt-2 is-flex" :class="btnsContainerClass">
			<div
				v-for="(action, index) in actions"
				:key="index"
				class="notification-btn pl-1 pr-1"
			>
				<Button
					:color="action.color"
					class="notification-action-btn"
					@click="handleActionClick(action.handler)"
				>
					{{ action.title }}
				</Button>
			</div>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { computed } from '@vue/reactivity';

export default {
	name: 'DefaultNotification',
	components: {
		Button,
	},
	props: {
		title: {
			type: String,
			default: null,
		},
		colorTitle: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
		actions: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		const handleActionClick = (handler) => {
			if (typeof handler !== 'function') {
				return;
			}

			handler();
		};

		const btnsContainerClass = computed(() => {
			if (props.actions.length === 1) {
				return 'ion-justify-content-center';
			}

			return 'ion-justify-content-between';
		});

		return {
			handleActionClick,
			btnsContainerClass,
		};
	},
};
</script>

<style lang="scss" scoped>
.title {
	color: var(--ion-text-color);
}

.subtitle {
	color: var(--dark-grey);
}

.default-notification {
	background: var(--ion-color-light);
	box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 10%);
	width: 100%;
}

.notification-action-btn {
	--padding-start: 30px;
	--padding-end: 30px;
	height: 35px !important;
}

.notification-btn {
	&:first-child {
		padding-left: 0 !important;
	}

	&:last-child {
		padding-right: 0 !important;
	}
}
</style>
