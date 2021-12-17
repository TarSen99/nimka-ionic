import { createAnimation } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const createHeadertAnimation = (header) => {
	return createAnimation()
		.addElement(header.$el)
		.duration(500)
		.fromTo('background', '', `var(--ion-color-light)`);
	// .fromTo('box-shadow', '', `0px 2px 4px 2px rgb(0 0 0 / 2%)`)
	// .afterStyles({
	//     'box-shadow': '0px 2px 4px 2px rgb(0 0 0 / 2%)'
	//   })
};

const createBackButtonAnimation = (btn) => {
	return createAnimation()
		.addElement(btn)
		.duration(300)
		.fromTo('color', '', `var(--ion-color-primary)`)
		.fromTo('--background', '', `rgba(0, 0, 0, 0.02)`);
};

const createTagAnimation = (tag) => {
	return createAnimation()
		.addElement(tag)
		.duration(1000)
		.fromTo('background', '', `var(--ion-color-primary)`);
};

const createContainerAnimation = (el) => {
	return createAnimation()
		.addElement(el)
		.duration(300)
		.fromTo('transform', 'translateY(0px)', `translateY(-100px)`);
};

const getStep = (y) => {
	return Math.min(y / 100, 1);
};

export default function() {
	const header = ref(null);
	const backButton = ref(null);
	const tag = ref(null);
	const container = ref(null);
	let started = false;
	let currentY = 0;
	let headertAnimation;
	let backButtonAnimation;
	let tagAnimation;
	let containerAnimation;

	const handleScroll = (e) => {
		currentY = e.detail.currentY;

		if (!started) {
			started = true;
			headertAnimation.progressStart();
			backButtonAnimation.progressStart();
			tagAnimation.progressStart();
			containerAnimation.progressStart();
		}

		tagAnimation.progressStep(getStep(currentY));
		headertAnimation.progressStep(getStep(currentY));
		backButtonAnimation.progressStep(getStep(currentY));
		containerAnimation.progressStep(getStep(currentY / 2));
	};

	onMounted(() => {
		headertAnimation = createHeadertAnimation(header.value);
		backButtonAnimation = createBackButtonAnimation(backButton.value.$el);
		containerAnimation = createContainerAnimation(container.value);
		tagAnimation = createTagAnimation(tag.value.$refs.el);
	});

	return {
		header,
		handleScroll,
		backButton,
		tag,
		container,
	};
}
