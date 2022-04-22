import { computed, ref } from 'vue';

export default function () {
	const loading = ref(false);
	const itemsList = ref([]);
	const orderBy = ref('date');
	const search = ref(null);
	const meta = ref({
		count: 0,
		limit: 0,
		offset: 0,
		page: 0,
	});

	const maxPage = computed(() => {
		return Math.ceil(meta.value.count / meta.value.limit);
	});

	const isDisabled = computed(() => {
		if (loading.value) {
			return true;
		}

		if (!itemsList.value.length) {
			return true;
		}

		if (meta.value.page >= maxPage.value) {
			return true;
		}

		return false;
	});

	const updateOrder = (v) => {
		orderBy.value = v;
	};

	const handleResponse = (res, page = 1, ev, doNotClearList) => {
		meta.value = res.data.meta;
		loading.value = false;

		if (ev) {
			ev.target.complete();
		}

		if (page !== 1) {
			itemsList.value = [...itemsList.value, ...res.data.data];
		}

		// If not items - just push new
		if (!itemsList.value.length) {
			itemsList.value = res.data.data;
			return;
		}

		if (!doNotClearList) {
			return;
		}

		// if there are already items, add only unique
		const itemsToAdd = [];
		for (const item of res.data.data) {
			const exists = itemsList.value.findIndex((el) => el.id === item.id);

			if (exists > -1) {
				itemsList.value.splice(exists, 1, item);
				continue;
			} else {
				itemsToAdd.push(item);
			}

			itemsList.value.unshift(...itemsToAdd);
			return;
		}
	};

	return {
		meta,
		maxPage,
		loading,
		isDisabled,
		itemsList,
		orderBy,
		updateOrder,
		search,
		handleResponse,
	};
}
