import { Dialog } from '@capacitor/dialog';

export default function () {
	const confirm = async ({ message }) => {
		const { value } = await Dialog.confirm({
			title: 'Confirm',
			message: message,
		});

		return value;
	};

	return {
		confirm,
	};
}
