import { ref, watch } from 'vue';

export default function ({ isLoading }) {
	const descriptionEl = ref(null);
	const showViewAll = ref(false);
	const viewAll = ref(false);

	const handleViewAll = () => {
		viewAll.value = !viewAll.value;
	};

	watch(
		() => isLoading.value,
		(v) => {
			if (v) {
				return;
			}

			setTimeout(() => {
				const scrollHeight = descriptionEl.value.scrollHeight;
				const offsetHeight = descriptionEl.value.offsetHeight;

				if (scrollHeight > offsetHeight) {
					showViewAll.value = true;
					return;
				}

				showViewAll.value = false;
			});
		}
	);

	return {
		descriptionEl,
		showViewAll,
		handleViewAll,
		viewAll,
	};
}
