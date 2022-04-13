<template>
	<div>
		<h2 class="fz-18">Payment method</h2>

		<div>
			<ion-radio-group
				mode="md"
				v-model="paymentType"
				@IonChange="handlePaymentTypeChange"
			>
				<ion-item class="radio-item">
					<ion-label class="is-flex ion-align-items-center">
						<ion-icon :icon="cardOutline" class="mr-2 icon"></ion-icon>
						<span class="fw-500"> Credit Card </span>
					</ion-label>
					<ion-radio slot="start" value="card"></ion-radio>
				</ion-item>

				<transition name="fade-slide">
					<div v-if="paymentType === 'card'">
						<div class="pb-5">
							<div class="visa-master pt-2">
								<img src="@/assets/images/payment.png" alt="" class="img" />
							</div>

							<Input
								label="Card number"
								class="input"
								placeholder="0000 0000 0000 0000"
								@update:modelValue="handleCardInput"
								:model-value="card"
								:error="errorCard"
							/>
							<div class="is-flex">
								<Input
									label="Date"
									class="input mr-5"
									placeholder="02 / 24"
									@update:modelValue="handleDateInput"
									:model-value="date"
									:error="errorDate"
								/>

								<Input
									label="CVC"
									class="input"
									placeholder="000"
									@update:modelValue="handleCvcInput"
									:model-value="cvc"
									:error="errorCvc"
								/>
							</div>

							<ion-item
								v-if="allCardDetailsAreValid"
								class="checkbox-container"
								lines="none"
							>
								<ion-checkbox
									slot="start"
									@update:modelValue="saveCardDetails = $event"
									:modelValue="saveCardDetails"
									mode="md"
								>
								</ion-checkbox>
								<ion-label>Save card details</ion-label>
							</ion-item>
						</div>
					</div>
				</transition>

				<ion-item class="radio-item">
					<ion-label class="is-flex ion-align-items-center">
						<ion-icon :icon="cashOutline" class="mr-2 icon"></ion-icon>
						<span class="fw-500"> Cash </span>
					</ion-label>
					<ion-radio slot="start" value="cash"></ion-radio>
				</ion-item>

				<transition name="fade-slide">
					<div v-if="paymentType === 'cash'">
						<p class="color-grey pt-2 fw-500 cash-text">
							You'll pay with cash in restourant. No additional information is
							needed.
						</p>
					</div>
				</transition>
			</ion-radio-group>
		</div>
	</div>
</template>

<script>
import Input from '@/components/common/Input.vue';
import { reactive, ref } from '@vue/reactivity';
import {
	IonItem,
	IonLabel,
	IonRadio,
	IonRadioGroup,
	IonIcon,
	IonCheckbox,
} from '@ionic/vue';
import { cardOutline, cashOutline } from 'ionicons/icons';
import usePaymentValidation from '@/composables/checkout/paymentValidation.js';
import { watch } from '@vue/runtime-core';

export default {
	name: 'Payment',
	components: {
		Input,
		IonItem,
		IonLabel,
		IonRadio,
		IonRadioGroup,
		IonIcon,
		IonCheckbox,
	},
	setup(_, { emit }) {
		const {
			card,
			cvc,
			date,
			errorCard,
			errorDate,
			errorCvc,
			allCardDetailsAreValid,
			handleCardInput,
			handleDateInput,
			handleCvcInput,
		} = usePaymentValidation();

		const paymentType = ref(null);
		const saveCardDetails = ref(null);

		const handlePaymentTypeChange = (e) => {
			paymentType.value = e.target.value;
			emit('payment-type', paymentType.value);
		};

		watch(allCardDetailsAreValid, (newV) => {
			const data = {
				card: card.value,
				cvc: cvc.value,
				date: date.value,
				valid: newV,
			};

			emit('update-details', reactive(data));
		});

		return {
			card,
			cvc,
			date,
			errorCard,
			errorDate,
			errorCvc,
			handleCardInput,
			handleDateInput,
			handleCvcInput,
			cardOutline,
			cashOutline,
			paymentType,
			handlePaymentTypeChange,
			allCardDetailsAreValid,
			saveCardDetails,
		};
	},
};
</script>

<style lang="scss" scoped>
.visa-master {
	.img {
		width: 53px;
	}
}

::v-deep(.input) {
	.input-el {
		--background: var(--grey);
		text-align: center;
	}

	.label {
		color: var(--dark-grey);
		font-size: 14px !important;
	}
}

.radio-item,
.checkbox-container {
	--padding-start: 0 !important;
}

.icon {
	font-size: 20px;
}
</style>
