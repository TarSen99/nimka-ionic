import { toastController } from '@ionic/vue';

export default function () {
	const showMessage = ({
		text,
		color = 'danger',
		title = 'Error',
		duration = 2000,
	}) => {
		let toast;
		toastController
			.create({
				header: title,
				message: text,
				position: 'top',
				color,
				duration,
				htmlAttributes: { tabindex: undefined },
			})
			.then((res) => {
				toast = res;
				toast.present();
			});
	};

	return {
		showMessage,
	};
}
