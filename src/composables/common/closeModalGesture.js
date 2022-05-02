import { createGesture } from '@ionic/vue';
import { ref, watch } from 'vue';

export default function ({ isOpen, close, refEl }) {
	let verticalGesture;

	const onMoveHandler = (detail) => {
		if (detail.velocityY > 0.1) {
			console.log('HANDLED');
		}
		console.log(detail);
	};

	watch(
		() => {
			return isOpen.value;
		},
		(open) => {
			if (!open) {
				if (verticalGesture) {
					verticalGesture.destroy();
					verticalGesture = null;
				}

				return;
			}

			setTimeout(() => {
				verticalGesture = createGesture({
					el: refEl.value.$el.children[0],
					threshold: 1,
					gestureName: 'verticalGesture',
					onMove: (ev) => onMoveHandler(ev),
					direction: 'y',
					gesturePriority: 99999999,
				});

				verticalGesture.enable();
			}, 100);
		}
	);

	return {};
}
