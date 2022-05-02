<template>
	<div
		ref="notification"
		class="default-notification ion-padding"
		@click="handleClick"
	>
		<span class="close" @click="close($event)">
			<ion-icon :icon="closeOutline" class="color-dark" />
		</span>
		<p class="fw-500 title">
			{{ title }}
		</p>
		<p class="fw-400 subtitle fz-14 mt-1">
			{{ subtitle }}
		</p>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { computed, ref, toRefs } from '@vue/reactivity';
import { IonIcon } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { createGesture } from '@ionic/vue';
import { onBeforeUnmount, onMounted } from '@vue/runtime-core';
import { createAnimation } from '@ionic/vue';

const normalize = (value) => {
	const max = 0;
	const min = 1;
	const currV = value / (window.innerWidth / 2);

	return Math.abs((Math.abs(currV) - min) / (max - min));
};

export default {
	name: 'DefaultNotification',
	components: {
		Button,
		IonIcon,
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
	},
	setup(props, { emit }) {
		const notification = ref(null);

		const handleActionClick = (handler, type) => {
			if (type === 'close') {
				emit('close');
				return;
			}

			if (typeof handler !== 'function') {
				return;
			}

			handler();
		};

		const close = (e) => {
			e.stopPropagation();
			handleActionClick(null, 'close');
		};

		const handleClick = () => {
			emit('select');
		};

		let gesture;
		let started;

		const onMoveHandler = (e) => {
			if (!started) {
				return;
			}

			const deltaX = e.deltaX;

			const normalized = normalize(deltaX);

			requestAnimationFrame(() => {
				notification.value.style.transform = `translateX(${deltaX * 1.5}px)`;
				notification.value.style.opacity = normalized;
			});
		};

		const destroyItem = () => {
			if (gesture) {
				gesture.destroy();
			}

			setTimeout(() => {
				handleActionClick(null, 'close');
			}, 200);
		};

		onMounted(() => {
			setTimeout(() => {
				gesture = createGesture({
					el: notification.value,
					threshold: 15,
					gestureName: 'horizontalGesture',
					onStart: () => {
						started = true;
					},
					onMove: (ev) => onMoveHandler(ev),
					onEnd: (ev) => {
						if (!started) {
							return;
						}

						if (ev.deltaX <= -window.innerWidth / 3) {
							requestAnimationFrame(() => {
								notification.value.style.transform = `translateX(-300px)`;
								notification.value.style.opacity = 0;
							});

							destroyItem();
							return;
						}

						if (ev.deltaX >= window.innerWidth / 3) {
							requestAnimationFrame(() => {
								notification.value.style.transform = `translateX(300px)`;
								notification.value.style.opacity = 0;
							});

							destroyItem();
							return;
						}

						requestAnimationFrame(() => {
							notification.value.style.transform = `translateX(0)`;
							notification.value.style.opacity = 1;
						});

						started = false;
					},
					direction: 'x',
				});

				gesture.enable();
			}, 100);
		});

		onBeforeUnmount(() => {
			if (gesture) {
				gesture.destroy();
				gesture = null;
			}
		});

		return {
			notification,
			handleActionClick,
			closeOutline,
			close,
			handleClick,
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

.close {
	position: absolute;
	right: 5px;
	top: 10px;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.default-notification {
	background: var(--white);
	box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 10%);
	width: 100%;
	border-radius: 5px;
	position: relative;
	transition: all 0.2s ease;
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
