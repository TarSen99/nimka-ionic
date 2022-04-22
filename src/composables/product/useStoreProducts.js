import { computed } from 'vue';
import { useStore } from 'vuex';

export default function () {
	const store = useStore();

	const totalBoughtCount = computed(() => {
		const saved = store.state.products.products;

		return saved.length;
	});

	const totalPrice = computed(() => {
		return store.getters['products/totalPrice'];
	});

	return {
		totalBoughtCount,
		totalPrice,
	};
}
