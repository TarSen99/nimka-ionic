import { PLACEHOLDER } from '@/config/constants.js';

export default function () {
	const getImage = (images) => {
		if (images && images.length) {
			return images[0].url;
		}

		return PLACEHOLDER;
	};

	const getImages = (images) => {
		if (images && images.length) {
			return images;
		}

		return [{ url: PLACEHOLDER }];
	};

	return {
		getImage,
		getImages,
	};
}
