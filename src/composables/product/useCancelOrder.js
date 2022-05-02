import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import useDialog from '@/composables/common/dialog.js';
import useAlert from '@/composables/common/alert.js';

export default function ({ activeOrder }) {
	const { confirm } = useDialog();

	const cancel = async (showLoader) => {
		const result = await confirm({
			message: 'Are you sure you want to cancel order?',
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
