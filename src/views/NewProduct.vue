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
						{{ showHistory ? 'New Product' : 'Edit product' }}
					</ion-title>

					<span class="right-notch"></span>
				</div>
			</ion-toolbar>
		</ion-header>

		<IonContent :fullscreen="true">
			<div class="ion-padding">
				<ProductsHistory v-if="showHistory" @prefill="prefillData" />

				<div class="form">
					<Input
						v-model="title"
						class="input"
						placeholder="Title"
						label="Title"
					/>

					<Input
						v-model="description"
						class="input"
						placeholder="Description"
						label="Description"
						textarea
					/>

					<div class="is-flex">
						<Input
							v-model="availableCount"
							class="input mr-3 w-100"
							placeholder="1"
							label="Available count"
							type="tel"
							@update:modelValue="onAvailableCount"
						/>

						<Input
							v-model="availableCountPerPerson"
							class="input w-100"
							placeholder="1"
							label="Available count per person"
							type="tel"
						/>
					</div>

					<p class="mt-1 fw-500 fz-14 color-grey">
						<span class="color-danger">*</span> Enter "99" if there is a lot
					</p>

					<div class="mt-3">
						<Input
							v-model="fullPrice"
							class="input w-100"
							placeholder="1"
							label="Full price, UAH"
							type="tel"
							@update:modelValue="handleFullPriceChange"
						/>
					</div>

					<div class="is-flex">
						<Input
							v-model="discountPercent"
							class="input mr-3 w-100"
							placeholder="50"
							label="Discount percent, %"
							type="tel"
							@update:modelValue="handleDiscountInput('percent')"
						/>

						<Input
							v-model="discountPrice"
							class="input w-100"
							placeholder="50"
							label="Price with discount, UAH"
							type="tel"
							@update:modelValue="handleDiscountInput('price')"
						/>
					</div>

					<div class="mt-3">
						<div>
							<p class="fw-400 fz-14 color-dark-grey">Take time</p>

							<div class="is-flex ion-justify-content-end time-inputs">
								<input
									type="text"
									placeholder="From"
									id="start_time"
									class="date-input mr-2 w-100"
									:value="startTimeFormatted"
								/>

								<input
									type="text"
									placeholder="To"
									id="end_time"
									class="date-input w-100"
									:value="endTimeFormatted"
								/>

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
							<p class="fw-400 fz-14 color-dark-grey">Images</p>

							<div v-if="!images.length" class="mt-2">
								<Button
									expand="block"
									color="primary"
									@click="handlePhotoClick"
								>
									Upload images
								</Button>
							</div>

							<div v-else class="mt-2">
								<images-slider v-model="images" />

								<Button
									expand="block"
									color="primary"
									class="mt-2"
									@click="handlePhotoClick"
								>
									Add images
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ionFab
				vertical="bottom"
				horizontal="left"
				slot="fixed"
				class="w-100 create-container pb-5"
			>
				<div class="w-100 ion-padding">
					<Button @click="handleSubmit" class="mt-5" expand="block">
						Create
					</Button>
				</div>
			</ionFab>
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
} from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import { ref } from '@vue/reactivity';
import { chevronBackOutline } from 'ionicons/icons';
import { computed } from '@vue/runtime-core';
import { format, parseISO } from 'date-fns';
import Button from '@/components/common/Button.vue';
import useCamera from '@/composables/new-product/camera.js';
import ImagesSlider from '@/components/new-product/ImagesSlider.vue';
import ProductsHistory from '@/components/new-product/ProductsHistory.vue';
import { useRouter, useRoute } from 'vue-router';

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
	},
	setup() {
		const title = ref(null);
		const description = ref(null);
		const availableCount = ref(null);
		const availableCountPerPerson = ref(null);
		const fullPrice = ref(null);
		const discountPercent = ref(null);
		const discountPrice = ref(null);
		const startTime = ref(new Date());
		const endTime = ref(new Date());
		const images = ref([]);
		const { showCameraOptions } = useCamera();
		const router = useRouter();
		const route = useRoute();

		const handlePhotoClick = async () => {
			const photos = await showCameraOptions();

			images.value.push(
				...(photos || []).map((img) => {
					return {
						base64: img.Base64,
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
				discountPrice.value = getPriceOnPercent(
					fullPrice.value,
					discountPercent.value
				);
				return;
			}

			const onePercentValue = fullPrice.value / 100;

			const percentSubsctructDiscount = Math.round(
				discountPrice.value / onePercentValue
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

			discountPrice.value = getPriceOnPercent(
				fullPrice.value,
				discountPercent.value
			);
		};

		const handleSubmit = () => {
			router.replace('/new-product-success');
		};

		const onAvailableCount = () => {
			availableCountPerPerson.value = availableCount.value;
		};

		const prefillData = (data) => {
			title.value = data.title;
			description.value = data.description;
			availableCount.value = data.availableCount;
			availableCountPerPerson.value = data.availableCountPerPerson;
			fullPrice.value = data.fullPrice;
			discountPercent.value = data.discountPercent;
			discountPrice.value = data.discountPrice;
			startTime.value = data.startTime;
			endTime.value = data.endTime;
		};

		const showHistory = computed(() => {
			return !route.params.id;
		});

		return {
			title,
			availableCount,
			availableCountPerPerson,
			chevronBackOutline,
			fullPrice,
			discountPercent,
			discountPrice,
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
		};
	},
};
</script>

<style lang="scss" scoped>
::v-deep(.input) {
	.input-el {
		--background: var(--grey);
	}

	.label {
		color: var(--dark-grey);
		font-size: 14px !important;
		font-weight: 400;
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

.date-input {
	outline: none;
	border: none;
	border-radius: 50px;
	height: 50px;
	text-align: center;
	background: var(--grey);

	&::placeholder {
		color: var(--ion-color-medium);
	}
}

.create-container {
	background-color: rgba(255, 255, 255, 0.7);
	bottom: 0;
}

.form {
	padding-bottom: 130px;
}

// .popover {
// 	--offset-y: -200px;
// }
</style>

<style lang="scss"></style>
