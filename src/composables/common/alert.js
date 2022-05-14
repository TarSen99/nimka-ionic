import { toastController } from '@ionic/vue';
import i18n from '@/i18n.js';

const { t } = i18n.global;

export default function () {
	const showMessage = ({
		text,
		color = 'danger',
		title = t('common.error'),
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
