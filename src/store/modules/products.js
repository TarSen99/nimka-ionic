export default {
	namespaced: true,
	state: () => ({
		products: [],
	}),
	mutations: {
		clear(state) {
			state.products = [];
		},
		addProduct(state, product) {
			const existing = state.products.find((p) => p.id === product.id);

			if (existing) {
				existing.count++;
				return;
			}

			state.products.push({
				...product,
				count: 1,
			});
		},
		removeProduct(state, product) {
			const newProducts = [...state.products];
			const existingIndex = state.products.findIndex(
				(p) => p.id === product.id
			);

			if (existingIndex > -1) {
				const count = state.products[existingIndex].count;

				if (count === 1) {
					newProducts.splice(existingIndex, 1);
					state.products = newProducts;
				} else {
					state.products[existingIndex].count--;
				}
			}
		},
	},
	getters: {
		totalPrice(state) {
			const total = state.products.reduce((prev, curr) => {
				const currPrice = curr.count * curr.priceWithDiscount;

				return prev + currPrice;
			}, 0);

			if (Math.round(total) === total) {
				return total;
			}

			return total.toFixed(2);
		},
	},
	actions: {},
};
