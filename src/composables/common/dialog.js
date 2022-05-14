import { Dialog } from '@capacitor/dialog';
import { useI18n } from 'vue-i18n/index';

export default function () {
	const { t } = useI18n();

	const confirm = async ({ message }) => {
		const { value } = await Dialog.confirm({
			title: t('common.confirm'),
			okButtonTitle: t('common.yes'),
			cancelButtonTitle: t('common.no'),
			message: message,
		});

		return value;
	};

	return {
		confirm,
	};
}
