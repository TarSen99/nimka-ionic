<template>
	<div class="mb-4 product-categories">
		<products-section
			v-if="popular && popular.length"
			:title="t('home.popular')"
			:products="popular"
			:class="{ 'pr-section': popular && popular.length }"
			class="mb-4 product-categories-item"
		>
			<template #pre> <span class="pre"> 🧡</span> </template>
		</products-section>
		<products-section
			v-if="hot && hot.length"
			:title="`🔥 ${t('home.hot')}`"
			:products="hot"
			:class="{ 'pr-section': hot && hot.length }"
			class="mb-4 product-categories-item"
		/>
		<products-section
			v-if="hurry && hurry.length"
			:title="`${t('home.hurry')}`"
			:products="hurry"
			:class="{ 'pr-section': hurry && hurry.length }"
			class="mb-4 product-categories-item"
		>
			<template #pre> <span class="pre"> 🤤 </span> </template>
		</products-section>
	</div>
</template>

<script>
import ProductsSection from '@/components/common/ProductsSection.vue';
import { ref, toRefs } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import http from '@/services/http';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'ProductCategories',
	components: {
		ProductsSection,
	},
	props: {
		update: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['has', 'updated'],
	setup(props, { emit }) {
		const popular = ref([]);
		const hot = ref([]);
		const hurry = ref([]);
		const { update } = toRefs(props);
		const { t } = useI18n();

		const getCategoty = (category, list) => {
			return http.get(`/products?filter=${category}`).then((res) => {
				list.value = res.data.data;

				return res.data.data;
			});
		};

		watch(
			() => {
				return update.value;
			},
			(newV) => {
				if (!newV) {
					return;
				}

				emit('updated');

				Promise.all([
					getCategoty('popular', popular),
					getCategoty('hot', hot),
					getCategoty('hurry_to_take', hurry),
				]).then(([r, r2, r3]) => {
					if (r.length || r2.length || r3.length) {
						return emit('has', true);
					}

					emit('has', false);
				});
			},
			{
				immediate: true,
			}
		);

		return {
			popular,
			hot,
			hurry,
			t,
		};
	},
};
</script>

<style scoped lang="scss">
.pr-section {
	// padding: 10px 5px;
	// border-radius: 5px;
	// background: var(--white);
}

::v-deep(.product-categories-item) {
	.food-item {
		// background-color: var(--ion-color-light) !important;
	}

	.section-title {
		padding-left: 10px;
	}
}

.pre {
	// display: flex;
	// border-radius: 50%;
	// background: var(--white);
	// height: 30px;
	// width: 30px;
	// align-items: center;
	// justify-content: center;
	margin-right: 5px;
}
</style>
