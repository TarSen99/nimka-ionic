import { toastController } from '@ionic/vue';

export default function() {
	const showMessage = async ({
		text,
		color = 'danger',
		title = 'Error',
		duration = 2000,
	}) => {
		const toast = await toastController.create({
			header: title,
			message: text,
			position: 'top',
			color,
			duration,
		});

		toast.present();
	};

	return {
		showMessage,
	};
}
