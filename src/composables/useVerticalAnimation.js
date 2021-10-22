import { createGesture, createAnimation } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import {createYGesure} from '@/helpers/gestures.js'

const MAX_BOTTOM_SCREEN_TRANSLATE = -100;
const MAX_TEXT_TRANSLATE = 20;

const getStep = (ev) => {
	const delta = Math.abs(ev.deltaY);
	return Math.min(-delta / MAX_BOTTOM_SCREEN_TRANSLATE, 1);
};

const createBottomScreenAnimation = (bottomScreen) => {
	return createAnimation()
		.addElement(bottomScreen.value)
		.duration(300)
		.fromTo('transform', 'translateY(0)', `translateY(${MAX_BOTTOM_SCREEN_TRANSLATE}px)`);
};

const createTopTextAnimation = (topText) => {
	return createAnimation()
		.addElement(topText.value)
		.duration(300)
		.fromTo(
			'transform',
			'translateY(0)',
			`translateY(${MAX_TEXT_TRANSLATE}px)`
		);
};

export default function() {
	const bottomScreen = ref(null);
	const topText = ref(null);
	let started = false;

	const onMove = (e, animations) => {
		if (!started) {
			// if (e.deltaY > 0) {
			// 	return;
			// }

			started = true;
			animations.forEach((an) => {
				an.progressStart();
			});
		}

		animations.forEach((an) => {
			an.progressStep(getStep(e));
		});
	};

	const onEnd = (e, animations, gesture) => {
		if (!started) {
			return;
		}

		const step = getStep(e);

		gesture.enable(false);

		let finishedCount = 0;
		animations.forEach((an) => {
			an.progressEnd(0, step, 200).onFinish(() => {
				finishedCount++;

				if (finishedCount === animations.length) {
					started = false;
					gesture.enable(true);
				}
			});
		});
	};

	onMounted(() => {
		const bottomScreenAnimation = createBottomScreenAnimation(bottomScreen);
		const topTextAnimation = createTopTextAnimation(topText);

		const dragGesture = createYGesure({
			ref: bottomScreen,
			onMove,
			onEnd,
			animations: [bottomScreenAnimation, topTextAnimation],
		});

		dragGesture.enable(true);
	});

	return {
		bottomScreen,
		topText,
	};
}
