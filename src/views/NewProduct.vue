<template>
	<IonPage>
		<ion-header mode="md" class="header">
			<ion-toolbar mode="md" class="toolbar" color="primary">
				<div
					ref="header"
					class="is-flex ion-justify-content-between w-100 ion-align-items-center px-4 header-content relative"
				>
					<ion-buttons>
						<ion-button
							class="back-btn default-icon-btn"
							ref="backButton"
							@click.prevent="$router.back()"
						>
							<ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
						</ion-button>
					</ion-buttons>

					<ion-title class="ion-text-center">
						{{
							showHistory ? t('new_product.title') : t('new_product.edit_title')
						}}
					</ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<IonContent :fullscreen="true">
			<div class="ion-padding">
				<ProductsHistory
					v-if="showHistory"
					@prefill="prefillData"
					:products="lastProducts"
					:loading="loadingProducts"
				/>

				<div class="form">
					<div>
						<p class="pr-title mt-3">{{ t('new_product.pr_type') }}</p>

						<div class="filters-list is-flex mt-2">
							<div
								class="product-type mr-2"
								:class="{
									active: productType === 'regular',
									disabled: productTypeIsDisabled,
								}"
								@click="changeProductType('regular')"
							>
								{{ t('new_product.regular') }}
							</div>

							<div
								class="product-type mr-2"
								:class="{
									active: productType === 'niambox',
									disabled: productTypeIsDisabled,
								}"
								@click="changeProductType('niambox')"
							>
								{{ t('new_product.niambox') }}
							</div>
						</div>
					</div>

					<Input
						v-show="productType === 'regular'"
						v-model="title"
						class="input"
						:placeholder="t('new_product.title_field')"
						:label="t('new_product.title_field')"
						:error="titleError"
					/>

					<Input
						v-model="description"
						class="input"
						:placeholder="
							productType === 'regular'
								? t('new_product.description')
								: t('new_product.descr_niam')
						"
						:label="
							productType === 'regular'
								? t('new_product.description')
								: t('new_product.descr_niam')
						"
						textarea
						:error="descriptionError"
					/>

					<div class="is-flex">
						<Select
							v-model="availableCount"
							class="w-50 mr-3"
							:label="t('new_product.available')"
							:placeholder="t('new_product.available')"
							:options="PRODUCT_COUNT_OPTIONS"
							:error="availableCountError"
							@update:modelValue="onAvailableCount"
						/>

						<Select
							v-model="availableCountPerPerson"
							:label="t('new_product.per')"
							:placeholder="t('new_product.per')"
							class="w-50"
							:options="PRODUCT_COUNT_OPTIONS"
							:error="availableCountPerPersonError"
						/>
					</div>

					<div class="mt-3">
						<Input
							v-model="fullPrice"
							class="input w-100"
							placeholder="1"
							:label="
								productType === 'regular'
									? t('new_product.full')
									: t('new_product.approx')
							"
							type="tel"
							@update:modelValue="handleFullPriceChange"
							:error="fullPriceError"
						/>
					</div>

					<div class="is-flex">
						<Input
							v-model="discountPercent"
							class="input mr-3 w-100"
							placeholder="50"
							:label="t('new_product.disc_perc')"
							type="tel"
							@update:modelValue="handleDiscountInput('percent')"
							:error="discountPercentError"
						/>

						<Input
							v-model="priceWithDiscount"
							class="input w-100"
							placeholder="50"
							:label="t('new_product.disc_price')"
							type="tel"
							@update:modelValue="handleDiscountInput('price')"
							:error="priceWithDiscountError"
						/>
					</div>

					<div v-if="!$route.params.id" class="mt-3">
						<div>
							<p class="fw-400 fz-14 color-dark-grey">
								{{ t('new_product.take') }}
							</p>

							<div class="is-flex ion-justify-content-end time-inputs">
								<input
									type="text"
									:placeholder="t('new_product.from')"
									id="start_time"
									class="date-input mr-2 w-100"
									:value="startTimeFormatted"
									:error="startTimeError"
								/>
								<div class="w-100">
									<input
										type="text"
										:placeholder="t('new_product.to')"
										id="end_time"
										class="date-input w-100"
										:value="endTimeFormatted"
										:error="endTimeError"
									/>

									<transition name="slide-y">
										<p
											v-if="tomorrowDayValue"
											class="fz-14 fw-500 color-danger mt-2"
										>
											{{ t('new_product.for_tomorrow') }} -
											{{ tomorrowDayValue }}
										</p>
									</transition>
								</div>

								<ionPopover
									trigger="start_time"
									side="top"
									alignment="center"
									class="popover"
								>
									<IonDatetime
										@ion-change="handleTimeChange($event, 'start')"
										presentation="time"
										hourCycle="h23"
									></IonDatetime>
								</ionPopover>

								<ionPopover
									trigger="end_time"
									side="top"
									alignment="center"
									class="popover"
								>
									<IonDatetime
										@ion-change="handleTimeChange($event, 'end')"
										presentation="time"
										hourCycle="h23"
									></IonDatetime>
								</ionPopover>
							</div>
						</div>
					</div>

					<div class="mt-3">
						<div>
							<p class="fw-400 fz-14 color-dark-grey">
								{{ t('new_product.images') }}
							</p>

							<div v-if="!images.length" class="mt-2">
								<div class="upload-images" @click="handlePhotoClick">
									<span class="plus"> + </span>

									<p class="fz-14 color-dark fw-500">
										{{ t('new_product.upload') }}
									</p>
								</div>
							</div>

							<div v-else class="mt-2">
								<images-slider v-model="images" />

								<div class="upload-images mt-2" @click="handlePhotoClick">
									<span class="plus"> + </span>

									<p class="fz-14 color-dark fw-500">
										{{ t('new_product.upload') }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-5 pt-5">
						<Button @click="handleSubmit" class="mt-5" expand="block">
							{{
								$route.params.id
									? t('new_product.update')
									: t('new_product.create')
							}}
						</Button>
					</div>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
	IonTitle,
	IonDatetime,
	IonItem,
	IonLabel,
	IonPopover,
	IonFab,
	onIonViewWillEnter,
} from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Select from '@/components/common/Select.vue';
import { ref } from '@vue/reactivity';
import { chevronBackOutline } from 'ionicons/icons';
import { computed } from '@vue/runtime-core';
import { format, parseISO } from 'date-fns';
import Button from '@/components/common/Button.vue';
import useCamera from '@/composables/new-product/camera.js';
import ImagesSlider from '@/components/new-product/ImagesSlider.vue';
import ProductsHistory from '@/components/new-product/ProductsHistory.vue';
import { useRouter, useRoute } from 'vue-router';
import useNewProductData from '@/composables/new-product/newProductData.js';
import http from '@/services/http';
import useLoader from '@/composables/common/useLoader.js';
import { useStore } from 'vuex';
import { withTime } from '@/helpers/index.js';
import useCurrentPlace from '@/composables/common/currentPlace.js';
import { useI18n } from 'vue-i18n/index';

export default {
	name: 'NewProduct',
	components: {
		IonContent,
		IonPage,
		Input,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonIcon,
		IonTitle,
		IonDatetime,
		IonItem,
		IonLabel,
		IonPopover,
		Button,
		ImagesSlider,
		IonFab,
		ProductsHistory,
		Select,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const { activePlace } = useCurrentPlace();

		const {
			setErrors,
			validate,
			PRODUCT_COUNT_OPTIONS,
			handleUpdateTime,
			getData,

			title,
			description,
			availableCount,
			availableCountPerPerson,
			fullPrice,
			discountPercent,
			priceWithDiscount,
			startTime,
			endTime,
			tomorrowDayValue,
			savedProductData,
			productType,

			titleError,
			descriptionError,
			availableCountError,
			availableCountPerPersonError,
			fullPriceError,
			discountPercentError,
			priceWithDiscountError,
			startTimeError,
			endTimeError,
			getErrors,
		} = useNewProductData();
		const images = ref([]);
		const loadingProducts = ref(false);
		const { showCameraOptions } = useCamera();
		const { showLoader, hideLoader } = useLoader();
		const lastProducts = ref([]);
		const { t } = useI18n();

		const getPlaceProducts = () => {
			if (route.params.id) {
				return;
			}

			loadingProducts.value = true;
			return http
				.get(`/places/${activePlace.value}/products`)
				.then((res) => {
					lastProducts.value = res.data.data;
					loadingProducts.value = false;
				})
				.catch(() => {
					loadingProducts.value = false;
				});
		};

		const handlePhotoClick = async () => {
			await showLoader();
			const photos = await showCameraOptions();

			await hideLoader();

			images.value.push(
				...(photos || []).map((img) => {
					return {
						blob: img.blob,
						url: img.webPath,
					};
				})
			);
		};

		const startTimeFormatted = computed(() => {
			return format(startTime.value, 'HH:mm');
		});

		const endTimeFormatted = computed(() => {
			return format(endTime.value, 'HH:mm');
		});

		const handleTimeChange = (e, type) => {
			const v = parseISO(e.detail.value);

			if (type === 'start') {
				startTime.value = v;
				return;
			}

			endTime.value = v;
			handleUpdateTime();
		};

		const getPriceOnPercent = (fullPrice, discountPercent) => {
			const discount = (fullPrice / 100) * discountPercent;
			const discountFixed = discount.toFixed(1);

			return Math.max(fullPrice - discountFixed, 0);
		};

		const handleDiscountInput = (type) => {
			if (!fullPrice.value) {
				return;
			}

			if (type === 'percent') {
				priceWithDiscount.value = getPriceOnPercent(
					fullPrice.value,
					discountPercent.value
				);
				return;
			}

			const onePercentValue = fullPrice.value / 100;

			const percentSubsctructDiscount = Math.round(
				priceWithDiscount.value / onePercentValue
			);

			discountPercent.value = 100 - percentSubsctructDiscount;
		};

		const handleFullPriceChange = () => {
			if (!fullPrice.value) {
				return;
			}

			if (!discountPercent.value) {
				return;
			}

			priceWithDiscount.value = getPriceOnPercent(
				fullPrice.value,
				discountPercent.value
			);
		};

		const apiMethod = computed(() => {
			if (route.params.id) {
				return 'put';
			}

			return 'post';
		});

		const apiUrl = computed(() => {
			if (!route.params.id) {
				return '/products/add';
			}

			return `/products/${route.params.id}/update`;
		});

		const handleSubmit = async () => {
			const v = await validate();

			if (!v.valid) {
				return;
			}

			await showLoader();

			const data = getData(images.value, activePlace.value);

			http[apiMethod.value](apiUrl.value, data)
				.then((res) => {
					let query = '?';
					if (route.params.id) {
						query += 'updated=true';
					}

					router.replace(`/product-success/${res.data.data.id}${query}`);

					hideLoader();
				})
				.catch((err) => {
					hideLoader();
					setErrors(getErrors(err));
				});
		};

		const onAvailableCount = () => {
			availableCountPerPerson.value = availableCount.value;
		};

		const prefillData = (data, edit) => {
			if (edit) {
				savedProductData.value = data;
			}

			title.value = data.title;
			description.value = data.description;
			availableCount.value = data.initialCount;
			availableCountPerPerson.value = data.availableCountPerPerson;
			fullPrice.value = data.fullPrice;
			discountPercent.value = data.discountPercent;
			priceWithDiscount.value = data.priceWithDiscount;
			productType.value = data.productType;

			const { start, end } = withTime(data.takeTimeFrom, data.takeTimeTo);

			startTime.value = start;
			endTime.value = end;
			images.value = data.Images;
		};

		const showHistory = computed(() => {
			if (!loadingProducts.value && !lastProducts.value.length) {
				return false;
			}

			return !route.params.id;
		});

		const fetchProductDetails = async () => {
			if (!route.params.id) {
				return;
			}

			await showLoader();

			http
				.get(`/products/${route.params.id}`)
				.then((res) => {
					prefillData(res.data.data, true);

					hideLoader();
				})
				.catch((err) => {
					hideLoader();
				});
		};

		const productTypeIsDisabled = computed(() => {
			return !!route.params.id;
		});

		const changeProductType = (type) => {
			if (productTypeIsDisabled.value) {
				return;
			}

			productType.value = type;
		};

		onIonViewWillEnter(() => {
			getPlaceProducts();
			fetchProductDetails();
		});

		return {
			title,
			availableCount,
			availableCountPerPerson,
			chevronBackOutline,
			fullPrice,
			discountPercent,
			priceWithDiscount,
			handleTimeChange,
			startTimeFormatted,
			endTimeFormatted,
			images,
			handlePhotoClick,
			description,
			handleDiscountInput,
			handleFullPriceChange,
			handleSubmit,
			onAvailableCount,
			prefillData,
			showHistory,
			lastProducts,
			tomorrowDayValue,
			loadingProducts,
			productType,
			productTypeIsDisabled,

			PRODUCT_COUNT_OPTIONS,
			handleUpdateTime,
			changeProductType,

			titleError,
			descriptionError,
			availableCountError,
			availableCountPerPersonError,
			fullPriceError,
			discountPercentError,
			priceWithDiscountError,
			startTimeError,
			endTimeError,
			t,
		};
	},
};
</script>

<style lang="scss" scoped>
::v-deep(.input) {
	.input-el {
		--background: var(--white);
		background: var(--white);
		border-radius: 10px !important;
		border: 1px solid var(--ion-color-light-shade) !important;
	}

	.label {
		color: var(--dark-grey);
		font-size: 14px !important;
		font-weight: 400;
	}
}

.date-input {
	outline: none;
	border: none;
	border-radius: 50px;
	height: 50px;
	text-align: center;
	--background: var(--white);
	background: var(--white);
	border-radius: 10px !important;
	border: 1px solid var(--ion-color-light-shade) !important;

	&::placeholder {
		color: var(--ion-color-medium);
	}
}

.back-btn {
	color: var(--white);
	--background: rgba(255, 255, 255, 0.2);
}

.right-notch {
	min-width: 40px;
}

.time {
	width: 100px;
	height: 100px;
}

.time-inputs {
	margin-top: 4px;
}

.create-container {
	background-color: rgba(255, 255, 255, 0.7);
	bottom: 0;
}

.upload-images {
	display: flex;
	align-items: center;

	.plus {
		width: 30px;
		height: 30px;
		display: flex;
		font-size: 20px;
		margin-right: 5px;
		color: var(--white);
		background: var(--ion-color-success);
		font-weight: 600;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
}

.pr-title {
	color: var(--dark-grey);
	font-size: 14px !important;
	font-weight: 400;
}

.product-type {
	border-radius: 30px;
	padding: 10px 15px;
	text-align: center;
	font-weight: 500;
	color: var(--ion-color-dark);
	border: 2px solid var(--ion-color-dark);
	// background: var(--white);
	font-size: 14px;
	transition: all 0.2s ease;
	width: 50%;

	&.disabled {
		color: var(--ion-color-medium);
		border-color: var(--ion-color-medium);
	}

	&.active {
		background: var(--ion-color-dark);
		color: var(--white);
	}

	&.disabled.active {
		background: var(--ion-color-medium);
		color: var(--white);
	}
}

// .popover {
// 	--offset-y: -200px;
// }
</style>

<style lang="scss"></style>
