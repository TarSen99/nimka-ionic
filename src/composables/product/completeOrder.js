import { actionSheetController } from '@ionic/vue';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import http from '@/services/http';
import useAlert from '@/composables/common/alert.js';
import useLoader from '@/composables/common/useLoader.js';
import { Dialog } from '@capacitor/dialog';
import { ORDER_STATUSES } from '@/config/constants.js';

export default function ({ handleClose, details, emit }) {
	const { showMessage } = useAlert();
	const { showLoader, hideLoader } = useLoader();

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
					text: `Scanning was not successful`,
				});
			});
	};

	const getValueFromPrompt = async () => {
		const { value, cancelled } = await Dialog.prompt({
			title: 'Unique customer order number',
			message: `Please, ask customer for unique order number`,
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
					text: `Order was successfully completed`,
					title: 'Success',
				});

				emit('change-status', ORDER_STATUSES.COMPLETED);
				handleClose();
			})
			.catch(() => {
				hideLoader();
				let message;

				if (type === 'qr') {
					message = 'QR code is not valid';
				} else {
					message = 'Customer number is not valid';
				}

				showMessage({
					text: message,
				});
			});
	};

	const showActionSheet = async () => {
		const actionSheet = await actionSheetController.create({
			header: 'Complete order',
			cssClass: 'my-custom-class',
			buttons: [
				{
					text: 'By QR code',
					handler: () => {
						scan();
					},
				},
				{
					text: 'By customer unique number',
					handler: () => {
						getValueFromPrompt();
					},
				},
				{
					text: 'Cancel',
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
