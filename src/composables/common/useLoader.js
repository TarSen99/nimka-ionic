import { loadingController } from '@ionic/vue';
import { ref } from 'vue';

export default function () {
	const loader = ref(null);
	const isLoading = ref(false);

	const showLoader = async () => {
		isLoading.value = true;
		loader.value = await loadingController.create();

		await loader.value.present();
	};

	const hideLoader = () => {
		isLoading.value = false;
		loader.value.dismiss();
	};

	return {
		showLoader,
		hideLoader,
		isLoading,
	};
}
