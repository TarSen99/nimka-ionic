import { Camera, CameraResultType } from '@capacitor/camera';
import { ref } from 'vue';
import { loadingController } from '@ionic/vue';

export default function () {
	const images = ref([]);

	const showCameraOptions = async () => {
		const loading = await loadingController.create({});

		await loading.present();

		let result;

		try {
			result = await Camera.pickImages({
				quality: 90,
				allowEditing: true,
				resultType: CameraResultType.Uri,
			});
			console.log(result);

			loading.dismiss();

			images.value.push(...(result.photos || []));

			const save = [...images.value];
			images.value = [];

			return save;
		} catch (e) {
			console.log(e);
			loading.dismiss();
		}
	};

	return {
		showCameraOptions,
	};
}
