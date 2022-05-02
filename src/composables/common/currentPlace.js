import { computed } from 'vue';
import { useStore } from 'vuex';

export default function () {
	const store = useStore();

	const activePlace = computed(() => {
		return +store.state.user.activePlace;
	});

	const places = computed(() => {
		return store.state.company.places || [];
	});

	const currentPlaceDetails = computed(() => {
		const place = places.value.find((el) => el.id === activePlace.value);

		return place || {};
	});

	return {
		activePlace,
		currentPlaceDetails,
		places,
	};
}
