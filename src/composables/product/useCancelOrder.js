import http from '@/services/http';
import useDialog from '@/composables/common/dialog.js';
import { useI18n } from 'vue-i18n/index';

export default function ({ activeOrder }) {
	const { t } = useI18n();
	const { confirm } = useDialog();

	const cancel = async (showLoader) => {
		const result = await confirm({
			message: t('active_order.sure_cancel'),
		});

		if (!result) {
			return Promise.resolve(null);
		}

		showLoader();
		return http.delete(`/orders/${activeOrder.value.id}/cancel`);
	};

	return {
		cancel,
	};
}
