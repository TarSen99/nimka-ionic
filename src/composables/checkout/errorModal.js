import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default function () {
	const router = useRouter();
	const isOpen = ref(false);
	const errorData = ref(null);
	const store = useStore();

	const onClose = () => {
		store.commit('products/clear');
		errorData.value = null;
		isOpen.value = false;
		router.replace('/');
	};

	return {
		isOpen,
		onClose,
		errorData,
	};
}
