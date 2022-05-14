<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="view-product-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@willPresent="handlePresent"
			:breakpoints="[0, 0.9, 1]"
			:initialBreakpoint="0.9"
		>
			<div class="ion-padding modal-content">
				<div class="mb-3">
					<span class="field-value">
						<product-status-badge :status="currentProductDetails.status" />
					</span>
				</div>
				<div class="is-flex">
					<div class="logo mr-4">
						<img :src="companyDetails.logo" alt="" />
					</div>
					<modal-header
						class="w-100"
						:title="companyDetails.name"
						@close="handleClose"
					>
						<template #default>
							<p class="fz-14 color-grey view-description view-description-2">
								{{ currentPlaceDetails.address }}
							</p>
						</template>
					</modal-header>
				</div>

				<div class="mt-5">
					<div class="w-100">
						<div class="item">
							<div class="field-title">{{ t('view_product.created') }}:</div>

							<div>
								<span class="field-value">{{ createdAt }}</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">{{ t('view_product.title') }}:</div>

							<div>
								<span class="field-value">
									{{ currentProductDetails.title }}
								</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">
								{{ t('view_product.description') }}:
							</div>

							<div class="d-flex">
								<span
									class="field-value view-description"
									:class="{ viewAll }"
									ref="description"
									:key="currentProductDetails.id"
								>
									{{ currentProductDetails.description }}
								</span>

								<a
									v-if="showViewAll"
									href="#"
									@click.prevent="handleViewAll"
									class="fz-14"
								>
									{{ viewAll ? t('common.hide') : t('common.view_all') }}
								</a>
							</div>
						</div>

						<div class="item">
							<div class="field-title">{{ t('view_product.take') }}:</div>

							<div>
								<span class="field-value">{{ fromTime }} - {{ toTime }}</span>
							</div>
						</div>

						<!-- <div class="item">
							<div class="field-title">Total qUAHity:</div>

							<div>
								<span class="field-value">5</span>
							</div>
						</div> -->

						<div class="item">
							<div class="field-title">{{ t('view_product.available') }}:</div>

							<div>
								<span class="field-value">
									{{ currentProductDetails.availableCount }}
								</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">{{ t('view_product.full') }}:</div>

							<div>
								<span class="field-value"
									>{{
										currentProductDetails.fullPrice &&
										currentProductDetails.fullPrice.toFixed(2)
									}}
									{{ t('common.uah') }}</span
								>
							</div>
						</div>

						<div class="item">
							<div class="field-title">{{ t('view_product.disc') }}:</div>

							<div>
								<span class="field-value"
									>{{
										currentProductDetails.priceWithDiscount &&
										currentProductDetails.priceWithDiscount.toFixed(2)
									}}
									{{ t('common.uah') }}</span
								>
							</div>
						</div>

						<div class="item">
							<div class="field-title">{{ t('view_product.perc') }}:</div>

							<div>
								<span class="field-value"
									>{{ currentProductDetails.discountPercent }}%</span
								>
							</div>
						</div>

						<!-- <div class="item">
							<div class="field-title">Status:</div>

						</div> -->
					</div>
					<div class="mt-5">
						<hr class="hr" />
					</div>

					<div class="is-flex is-flex-direction-column">
						<div class="is-flex ion-justify-content-center mt-3 pb-2">
							<div
								v-if="currentProductDetails.status === PRODUCT_STATUSES.ACTIVE"
								class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
							>
								<Button class="action" @click="unpublishProduct">
									<ion-icon :icon="closeOutline" class="color-danger" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									{{ t('view_product.unpublish') }}
								</span>
							</div>

							<div
								v-if="
									currentProductDetails.status === PRODUCT_STATUSES.UNPUBLISHED
								"
								class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
							>
								<Button class="action" @click="unpublishProduct">
									<ion-icon :icon="checkmarkOutline" class="color-success" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									{{ t('view_product.publish') }}
								</span>
							</div>

							<div
								v-if="
									currentProductDetails.status ===
										PRODUCT_STATUSES.UNPUBLISHED ||
									currentProductDetails.status === PRODUCT_STATUSES.ACTIVE
								"
								class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
							>
								<Button @click="editProduct" class="action">
									<ion-icon :icon="pencilOutline" class="color-secondary" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									{{ t('view_product.edit') }}
								</span>
							</div>

							<div
								class="is-flex is-flex-direction-column ion-align-items-center"
							>
								<Button @click="view" class="action">
									<ion-icon :icon="eyeOutline" class="color-secondary" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									{{ t('view_product.view') }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ion-modal>
	</div>
</template>

<script>
import { IonModal, IonContent, modalController, IonIcon } from '@ionic/vue';
import ModalHeader from '@/components/common/ModalHeader.vue';
import Button from '@/components/common/Button.vue';
import {
	closeOutline,
	pencilOutline,
	checkmarkOutline,
	eyeOutline,
} from 'ionicons/icons';
import Badge from '@/components/common/Badge.vue';
import ProductStatusBadge from '@/components/admin/ProductStatusBadge.vue';
import { useRouter } from 'vue-router';
import { ref, toRefs } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import { useStore } from 'vuex';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import useAlert from '@/composables/common/alert.js';
import { PRODUCT_STATUSES } from '@/config/constants.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'ViewProductModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		Button,
		Badge,
		IonIcon,
		ProductStatusBadge,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		currentProductDetails: {
			type: Object,
			default: () => {},
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		const router = useRouter();
		const viewAll = ref(false);
		const showViewAll = ref(false);
		const description = ref(null);
		const { currentProductDetails } = toRefs(props);
		const store = useStore();
		const { showLoader, hideLoader } = useLoader();
		const { showMessage } = useAlert();
		const { currentPlaceDetails } = useCurrentPlace();
		const { t } = useI18n();

		const companyDetails = computed(() => {
			return store.state.company.details || {};
		});

		const createdAt = computed(() => {
			return DateTime.fromISO(currentProductDetails.value.createdAt).toFormat(
				'DD HH:mm'
			);
		});

		const fromTime = computed(() => {
			return DateTime.fromISO(
				currentProductDetails.value.takeTimeFrom
			).toFormat('HH:mm');
		});

		const toTime = computed(() => {
			return DateTime.fromISO(currentProductDetails.value.takeTimeTo).toFormat(
				'HH:mm'
			);
		});

		const handleClose = () => {
			showViewAll.value = false;
			viewAll.value = false;
			modalController.dismiss();
		};

		const editProduct = () => {
			handleClose();
			router.push(`/new-product/${currentProductDetails.value.id}`);
		};

		const handleViewAll = () => {
			viewAll.value = !viewAll.value;
		};

		const handlePresent = () => {
			viewAll.value = false;

			setTimeout(() => {
				const scrollHeight = description.value.scrollHeight;
				const offsetHeight = description.value.offsetHeight;

				if (scrollHeight > offsetHeight) {
					showViewAll.value = true;
					return;
				}

				showViewAll.value = false;
			}, 100);
		};

		const unpublishProduct = async () => {
			await showLoader();
			const currStatus = currentProductDetails.value.status;

			let message;
			let newStatus;

			if (currStatus === PRODUCT_STATUSES.ACTIVE) {
				message = t('view_product.success_unp');
				newStatus = PRODUCT_STATUSES.UNPUBLISHED;
			} else {
				message = t('view_product.success_pub');
				newStatus = PRODUCT_STATUSES.ACTIVE;
			}

			http
				.put(`/products/toggle/${currentProductDetails.value.id}`)
				.then(() => {
					showMessage({
						color: 'success',
						text: message,
						title: t('common.success'),
					});

					hideLoader();

					emit('close', newStatus);
				})
				.catch(() => {
					hideLoader();
				});
		};

		const view = () => {
			handleClose();
			router.push(`/product/${currentProductDetails.value.id}`);
		};

		return {
			handleClose,
			closeOutline,
			pencilOutline,
			editProduct,
			handleViewAll,
			viewAll,
			description,
			showViewAll,
			fromTime,
			toTime,
			createdAt,
			companyDetails,
			unpublishProduct,
			PRODUCT_STATUSES,
			checkmarkOutline,
			handlePresent,
			currentPlaceDetails,
			t,
			eyeOutline,
			view,
		};
	},
};
</script>

<style lang="scss">
@import '@/theme/mixins.scss';

.view-product-modal {
	@include default-modal-style;
}

.view-product-modal {
	.logo {
		width: 40px;
		min-width: 40px;
		height: 40px;
		overflow: hidden;
		border-radius: 50%;

		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>

<style lang="scss" scoped>
.field-title {
	font-size: 14px;
	color: #a4a4a4;
}

.field-value {
	font-size: 14px;
	color: var(--ion-color-dark);
	font-weight: 400;
}

.hr {
	background: #f2f2f2;
	max-width: 90%;
	margin: auto;
	margin-top: 10px;
	margin-bottom: 10px;
}

.item {
	margin-bottom: 5px;
}

.action {
	width: 50px;
	height: 50px;
	padding: 0;
	--padding-bottom: 0;
	--padding-end: 0;
	--padding-start: 0;
	--padding-top: 0;
	font-size: 14px;
	margin-right: 20px;
	box-shadow: 0px 2px 4px 2px rgb(0 0 0 / 3%);
	border-radius: 50%;
	--background: var(--white);
	--background-activated: var(--ion-color-light) !important;
	border-radius: 50%;

	&:last-of-type {
		margin-right: 0;
	}
}

.view-description {
	margin: 0;
	-webkit-line-clamp: 3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.viewAll {
	display: block;
}
</style>
