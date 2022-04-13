<template>
	<div class="modal" ref="container">
		<ion-modal
			:is-open="isOpen"
			:swipe-to-close="true"
			css-class="view-product-modal"
			mode="ios"
			@willDismiss="$emit('close')"
			@willPresent="handlePresentModal"
			:breakpoints="[0.9, 1]"
			:initialBreakpoint="0.9"
		>
			<div class="ion-padding modal-content">
				<div class="is-flex">
					<div class="logo mr-4">
						<img src="@/assets/images/logo.png" alt="" />
					</div>
					<modal-header class="w-100" title="Best burger" @close="handleClose">
					</modal-header>
				</div>

				<div>
					<div class="w-100">
						<div class="item">
							<div class="field-title">Created at:</div>

							<div>
								<span class="field-value">26.10.20 18:50</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Title:</div>

							<div>
								<span class="field-value">Best burger</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Description:</div>

							<div class="d-flex">
								<span
									class="field-value view-description"
									:class="{ viewAll }"
									ref="description"
									>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
									Quisquam aliquid, ex dolorum cupiditate molestias, est quod
									sint doloribus provident atque harum laudantium soluta
									voluptatum perferendis fugit, culpa iste sequi dolores!</span
								>

								<a
									v-if="showViewAll"
									href="#"
									@click.prevent="handleViewAll"
									class="fz-14"
								>
									{{ viewAll ? 'Hide' : 'View all' }}
								</a>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Take time:</div>

							<div>
								<span class="field-value">18:00 - 20:00</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Total qUAHity:</div>

							<div>
								<span class="field-value">5</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Available qUAHity:</div>

							<div>
								<span class="field-value">2</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Full price:</div>

							<div>
								<span class="field-value">50 UAH</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Price with discount:</div>

							<div>
								<span class="field-value">25 UAH</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Discount percent:</div>

							<div>
								<span class="field-value">50%</span>
							</div>
						</div>

						<div class="item">
							<div class="field-title">Status:</div>

							<div>
								<span class="field-value">
									<Badge color="success" class="px-3">
										<span class="fz-14"> Active </span>
									</Badge>
								</span>
							</div>
						</div>
					</div>
					<div class="mt-5">
						<hr class="hr" />
					</div>

					<div class="is-flex is-flex-direction-column">
						<div class="is-flex ion-justify-content-center mt-3 pb-2">
							<div
								class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
							>
								<Button class="action">
									<ion-icon :icon="closeOutline" class="color-danger" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									Unpublish
								</span>
							</div>

							<div
								class="is-flex is-flex-direction-column ion-align-items-center"
							>
								<Button @click="editProduct" class="action">
									<ion-icon :icon="pencilOutline" class="color-secondary" />
								</Button>
								<span class="ion-text-center mt-1 fz-12 color-dark">
									Edit
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
import { closeOutline, pencilOutline } from 'ionicons/icons';
import Badge from '@/components/common/Badge.vue';
import { useRouter } from 'vue-router';
import { ref, toRefs } from '@vue/reactivity';
import { nextTick, onMounted, watch } from '@vue/runtime-core';

export default {
	name: 'ViewProductModal',
	components: {
		IonModal,
		IonContent,
		ModalHeader,
		Button,
		Badge,
		IonIcon,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { emit }) {
		const router = useRouter();
		const viewAll = ref(false);
		const showViewAll = ref(false);
		const description = ref(null);
		const { isOpen } = toRefs(props);

		const handlePresentModal = () => {};

		const handleClose = () => {
			modalController.dismiss();
		};

		const editProduct = () => {
			handleClose();
			router.push('/new-product/1');
		};

		const handleViewAll = () => {
			viewAll.value = !viewAll.value;
		};

		watch(
			() => isOpen.value,
			(v) => {
				if (!v) {
					return;
				}

				setTimeout(() => {
					const scrollHeight = description.value.scrollHeight;
					const offsetHeight = description.value.offsetHeight;

					if (scrollHeight > offsetHeight) {
						showViewAll.value = true;
						return;
					}

					showViewAll.value = false;
				});
			}
		);

		return {
			handlePresentModal,
			handleClose,
			closeOutline,
			pencilOutline,
			editProduct,
			handleViewAll,
			viewAll,
			description,
			showViewAll,
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
		height: 40px;
		overflow: hidden;
		border-radius: 10px;
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
