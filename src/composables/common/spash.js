import { ref } from '@vue/reactivity';

const SPLASH_DELAY = 1000;

export default function() {
	const showSplash = ref(true);

	setTimeout(() => {
		showSplash.value = false;
	}, SPLASH_DELAY);

	return {
		showSplash,
	};
}
