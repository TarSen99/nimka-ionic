import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';

export default function () {
	const open = (url) => {
		InAppBrowser.create(url, '_system');
	};

	return {
		open,
	};
}
