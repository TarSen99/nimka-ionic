<template>
	<div>
		<div class="w-100">
			<div class="item">
				<div class="field-title">Order created at:</div>

				<div>
					<span class="field-value">26.10.20 18:50</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">QUAHity:</div>

				<div>
					<span class="field-value">2</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">Price per one:</div>

				<div>
					<span class="field-value">50 UAH</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">Payment method:</div>

				<div>
					<span class="field-value">Credit card</span>
				</div>
			</div>

			<div class="item">
				<div class="field-title">Status:</div>

				<div>
					<span class="field-value">PAYED</span>
				</div>
			</div>

			<div>
				<hr class="hr" />

				<div class="item">
					<div class="field-title">Customer name:</div>

					<div>
						<span class="field-value">Taras Seniv</span>
					</div>
				</div>

				<div class="item">
					<div class="field-title">Customer mobile:</div>

					<div>
						<span class="field-value">+380 96 904 53 49</span>
					</div>
				</div>
			</div>
		</div>

		<div>
			<hr class="hr" />
			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Total price:</div>

				<div>
					<span class="field-value">100 UAH</span>
				</div>
			</div>

			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Comission:</div>

				<div>
					<span class="field-value">-15 UAH</span>
				</div>
			</div>

			<div class="is-flex ion-justify-content-between item">
				<div class="field-title bottom">Total income:</div>

				<div>
					<span class="field-value total-income">+85 UAH</span>
				</div>
			</div>
		</div>

		<div class="is-flex is-flex-direction-column">
			<div class="is-flex ion-justify-content-center mt-3 pb-2">
				<div
					class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
				>
					<Button @click="scan" class="action">
						<ion-icon :icon="checkmarkOutline" class="color-success" />
					</Button>
					<span class="ion-text-center mt-1 fz-12 color-dark">
						Complete <br />
						order
					</span>
				</div>

				<div
					class="is-flex is-flex-direction-column ion-align-items-center mr-5 pr-5"
				>
					<Button class="action">
						<ion-icon :icon="callOutline" class="color-secondary" />
					</Button>
					<span class="ion-text-center mt-1 fz-12 color-dark">
						Call <br />
						customer
					</span>
				</div>
				<div class="is-flex is-flex-direction-column ion-align-items-center">
					<Button class="action">
						<ion-icon :icon="closeOutline" class="color-danger" />
					</Button>
					<span class="ion-text-center mt-1 fz-12 color-dark">
						Cancel <br />
						order
					</span>
				</div>
			</div>

			<p class="ion-text-center field-value color-dark mt-5 pt-5">
				Please ask customer to show QR code and scan it by clicking on "Complete
				order" button. <br />

				Customer needs to pickup order till
				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-14"> 20:00 </span>
				</Badge>
				or it will be automatically cancelled.
			</p>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import useAlert from '@/composables/common/alert.js';
import { modalController, IonIcon } from '@ionic/vue';
import { checkmarkOutline, callOutline, closeOutline } from 'ionicons/icons';

export default {
	name: 'OrderDetails',
	components: {
		Button,
		Badge,
		IonIcon,
	},
	setup(_, { emit }) {
		const { showMessage } = useAlert();

		const handleClose = () => {
			modalController.dismiss();
		};

		const scan = () => {
			BarcodeScanner.scan()
				.then((res) => {
					// console.log(res.text);
					showMessage({
						color: 'success',
						//text: `Text is: ${res.text}`,
						text: `Order is successfully completed`,
						title: 'Success',
					});

					// emit('complete-order');
					handleClose();
				})
				.catch(() => {
					showMessage({
						text: `Something went wrong. Plase try again`,
					});
				});
		};

		return {
			scan,
			checkmarkOutline,
			callOutline,
			closeOutline,
		};
	},
};
</script>

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

.total-income {
	font-size: 16px;
	font-weight: 500;
}

.payed {
	color: var(--ion-color-success);
}

.bottom {
	color: var(--ion-color-dark);
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
</style>
