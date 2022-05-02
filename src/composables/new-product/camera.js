import { Camera } from '@capacitor/camera';
import { ref } from 'vue';

// const convertBlobToBase64 = (blob) => {
// 	return new Promise((resolve, reject) => {
// 		const reader = new FileReader();
// 		reader.onerror = reject;
// 		reader.onload = () => {
// 			resolve(reader.result);
// 		};
// 		reader.readAsDataURL(blob);
// 	});
// };

const readAsBlob = async (photo) => {
	const response = await fetch(photo.webPath);
	const blob = await response.blob();

	return await blob;
};

export default function () {
	const images = ref([]);

	const showCameraOptions = async () => {
		let result;

		try {
			result = await Camera.pickImages({
				quality: 90,
				allowEditing: true,
				limit: 5,
			});
		} catch (e) {
			return;
		}

		for await (const photo of result.photos) {
			const blob = await readAsBlob(photo);

			photo.blob = blob;
		}

		images.value.push(...(result.photos || []));

		const save = [...images.value];
		images.value = [];

		return save;
	};

	return {
		showCameraOptions,
	};
}
