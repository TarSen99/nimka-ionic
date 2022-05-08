import { PLACEHOLDER, NIAMBOX_PLACEHOLDER } from '@/config/constants.js';

export default function () {
	const getImage = (images, type = 'regular') => {
		if (images && images.length) {
			return images[0].url;
		}

		if (type === 'regular') {
			return PLACEHOLDER;
		}

		return NIAMBOX_PLACEHOLDER;
	};

	const getImages = (images, type = 'regular') => {
		if (images && images.length) {
			return images;
		}

		if (type === 'regular') {
			return [{ url: PLACEHOLDER }];
		}

		return [{ url: NIAMBOX_PLACEHOLDER }];
	};

	return {
		getImage,
		getImages,
	};
}
