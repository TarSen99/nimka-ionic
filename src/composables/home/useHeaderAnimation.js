import { createAnimation } from '@ionic/vue';
import { onMounted, ref } from 'vue';

const createHeadertAnimation = (header) => {
	return createAnimation()
		.addElement(header)
		.duration(300)
		.fromTo('background', '', `var(--ion-color-light)`);
};

const createChangeBackgroundAnimation = (el) => {
	return createAnimation()
		.addElement(el)
		.duration(300)
		.fromTo('background', '', `var(--dark-grey) `);
};

const createChangeBackgroundInputAnimation = (el) => {
	return createAnimation()
		.addElement(el)
		.duration(200)
		.fromTo('background', '', `var(--dark-grey)`)
		.fromTo('color', '', `var(--white)`);
};

const createChangeColorInputAnimation = (el) => {
	return createAnimation()
		.addElement(el)
		.duration(200)
		.fromTo('color', '', `var(--white)`);
};

const createTopContentAnimation = (el) => {
	return createAnimation()
		.addElement(el)
		.duration(300)
		.fromTo('transform', 'translateY(0px)', `translateY(100px)`);
};

const getStep = (y) => {
	return Math.min(y / 200, 1);
};

export default function () {
	const pageContent = ref(null);
	const header = ref(null);
	const accountButton = ref(null);
	const searchInput = ref(null);
	const topContent = ref(null);
	let started = false;
	let currentY = 0;
	let headertAnimation;
	let buttonAnimation;
	let inputAnimation;
	let inputPlaceholderAnimation;
	let topContentAnimation;

	const handleScroll = (e) => {
		currentY = e.detail.currentY;

		if (!started) {
			started = true;
			headertAnimation.progressStart();
			buttonAnimation.progressStart();
			inputAnimation.progressStart();
			inputPlaceholderAnimation.progressStart();
			topContentAnimation.progressStart();
		}

		headertAnimation.progressStep(getStep(currentY));
		buttonAnimation.progressStep(getStep(currentY));
		inputAnimation.progressStep(getStep(currentY));
		inputPlaceholderAnimation.progressStep(getStep(currentY));
		topContentAnimation.progressStep(getStep(currentY));
	};

	onMounted(() => {
		headertAnimation = createHeadertAnimation(header.value.$el);
		buttonAnimation = createChangeBackgroundAnimation(accountButton.value.$el);
		topContentAnimation = createTopContentAnimation(
			topContent.value.$refs.filtersList
		);
		inputAnimation = createChangeBackgroundInputAnimation(
			searchInput.value.$refs.inputRef
		);
		inputPlaceholderAnimation = createChangeColorInputAnimation(
			searchInput.value.$refs.placeholder
		);
	});

	return {
		pageContent,
		header,
		accountButton,
		searchInput,
		handleScroll,
		topContent,
	};
}
