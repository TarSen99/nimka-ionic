import { actionSheetController } from '@ionic/vue';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import http from '@/services/http';
import useAlert from '@/composables/common/alert.js';
import useLoader from '@/composables/common/useLoader.js';
import { Dialog } from '@capacitor/dialog';
import { ORDER_STATUSES } from '@/config/constants.js';
import { useI18n } from 'vue-i18n/index';

export default function ({ handleClose, details, emit }) {
	const { showMessage } = useAlert();
	const { showLoader, hideLoader } = useLoader();
	const { t } = useI18n();

	const scan = () => {
		BarcodeScanner.scan()
			.then((res) => {
				let data;
				try {
					data = JSON.parse(res.text);
				} catch (e) {
					throw new Error('Error');
				}

				if (!data || typeof data !== 'object') {
					throw new Error('Error');
				}

				completeOrder(data.id, 'qr');
			})
			.catch(() => {
				showMessage({
					text: t('order_details.scan_fail'),
				});
			});
	};

	const getValueFromPrompt = async () => {
		const { value, cancelled } = await Dialog.prompt({
			title: t('order_details.secret'),
			message: t('order_details.ask_secret'),
		});

		if (cancelled) {
			return;
		}

		completeOrder(value, 'code');
	};

	// number: 21222
	// type: qr || code
	const completeOrder = (number, type) => {
		showLoader();

		http
			.put(`/orders/${details.value.id}/complete-order`, {
				customerNumber: number,
			})
			.then(() => {
				hideLoader();
				showMessage({
					color: 'success',
					text: t('order_details.completed'),
					title: t('common.success'),
				});

				emit('change-status', ORDER_STATUSES.COMPLETED);
				handleClose();
			})
			.catch(() => {
				hideLoader();
				let message;

				if (type === 'qr') {
					message = t('order_details.qr_invalid');
				} else {
					message = t('order_details.secret_invalid');
				}

				showMessage({
					text: message,
				});
			});
	};

	const showActionSheet = async () => {
		const actionSheet = await actionSheetController.create({
			header: t('order_details.complete_order'),
			cssClass: 'my-custom-class',
			buttons: [
				{
					text: t('order_details.by_qr'),
					handler: () => {
						scan();
					},
				},
				{
					text: t('order_details.by_secret'),
					handler: () => {
						getValueFromPrompt();
					},
				},
				{
					text: t('common.cancel'),
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					},
				},
			],
		});
		await actionSheet.present();
	};

	return {
		showActionSheet,
	};
}
