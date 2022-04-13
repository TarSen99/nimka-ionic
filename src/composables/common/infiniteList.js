import { computed, ref } from 'vue';

export default function () {
	const loading = ref(false);
	const itemsList = ref([]);
	const orderBy = ref('date');
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

	return {
		meta,
		maxPage,
		loading,
		isDisabled,
		itemsList,
		orderBy,
		updateOrder,
	};
}
