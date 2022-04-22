import { useStore } from 'vuex';
import { computed, ref } from '@vue/reactivity';
import { PAYMENT_TYPES } from '@/config/constants.js';
import { getProductsPickupTime } from '@/helpers';

export default function () {
	const store = useStore();
	const paymentType = ref(null);
	const paymentCard = ref(null);
	const editProductsAvailable = ref(true);
	const pickupTime = ref(null);

	const products = computed(() => {
		return store.state.products.products;
	});

	const placeId = computed(() => {
		return products.value[0]?.PlaceId;
	});

	const totalPrice = computed(() => {
		return store.getters['products/totalPrice'];
	});

	const clearProducts = () => {
		store.commit('products/clear');
	};

	const addProduct = (product) => {
		store.commit('products/addProduct', product);
	};

	const removeProduct = (product) => {
		store.commit('products/removeProduct', product);
	};

	const company = computed(() => {
		const product = products.value[0];

		return product?.Company || {};
	});

	const handleChangeCount = (type, product) => {
		if (type === 1) {
			addProduct(product);
			return;
		}

		removeProduct(product);
	};

	const handlePaymentTypeChange = (v) => {
		paymentType.value = v;

		if (paymentType.value === PAYMENT_TYPES.CASH) {
			paymentCard.value = null;
		}
	};

	const orderBtnIsDisabled = computed(() => {
		if (!totalPrice.value) {
			return true;
		}

		if (!paymentType.value) {
			return true;
		}

		return false;
	});

	const setPickupTime = () => {
		pickupTime.value = getProductsPickupTime(products.value);
	};

	return {
		products,
		placeId,
		totalPrice,
		clearProducts,
		addProduct,
		removeProduct,
		company,
		handleChangeCount,
		handlePaymentTypeChange,
		paymentType,
		paymentCard,
		orderBtnIsDisabled,
		editProductsAvailable,
		pickupTime,
		setPickupTime,
	};
}
