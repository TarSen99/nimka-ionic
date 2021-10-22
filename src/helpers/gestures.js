import { createGesture } from '@ionic/vue';

export const createYGesure = ({ ref, onMove, onEnd, animations }) => {
	const dragGesture = createGesture({
		el: ref.value,
		threshold: 0,
		gestureName: 'drag-y',
		onMove: (ev) => onMove(ev, animations),
		onEnd: (ev) => onEnd(ev, animations, dragGesture),
	});

	return dragGesture;
};