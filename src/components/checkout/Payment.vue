<template>
	<div>
		<h2 class="fz-18">{{ t('checkout.method') }}</h2>

		<div>
			<ion-radio-group
				mode="md"
				v-model="paymentType"
				@IonChange="handlePaymentTypeChange"
			>
				<ion-item class="radio-item" lines="none">
					<ion-label class="is-flex ion-align-items-center">
						<ion-icon :icon="cardOutline" class="mr-2 icon"></ion-icon>
						<span class="fw-500">{{ t('checkout.credit') }} </span>
					</ion-label>
					<ion-radio slot="start" value="card"></ion-radio>
				</ion-item>
				<transition name="fade-slide">
					<div v-if="paymentType === 'card'">
						<div
							v-for="card in cards"
							:key="card.id"
							class="card-item"
							:class="{ active: selectedCard === card.rectoken }"
						>
							<div
								class="is-flex ion-align-items-center"
								@click="itemClick(card)"
							>
								<div class="is-flex ion-align-items-center pb-3 pt-3 w-100">
									<div class="mr-5 logo">
										<img
											v-if="card.cardType.includes('visa')"
											src="@/assets/icons/visa.svg"
											alt=""
										/>
										<img
											v-if="card.cardType.includes('master')"
											src="@/assets/icons/master.svg"
											alt=""
										/>
									</div>

									<p class="fw-500 fz-18 color-dark">
										{{ card.mackedCard }}
									</p>
								</div>
							</div>
						</div>

						<div
							v-if="cards.length"
							key="add"
							class="card-item"
							@click="$emit('add-new')"
						>
							<div class="ion-text-center">
								<div class="pb-1 pt-1">
									<span class="vertical-align-middle fz-22 fw-500"> + </span>

									<span class="fw-500 fz-18 color-dark vertical-align-middle">
										{{ t('checkout.add_new') }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</transition>

				<ion-item class="radio-item" lines="none">
					<ion-label class="is-flex ion-align-items-center">
						<ion-icon :icon="cashOutline" class="mr-2 icon"></ion-icon>
						<span class="fw-500"> {{ t('checkout.cash') }} </span>
					</ion-label>
					<ion-radio slot="start" value="cash"></ion-radio>
				</ion-item>

				<transition name="fade-slide">
					<div v-if="paymentType === 'cash'">
						<p class="color-grey pt-2 fw-500 cash-text">
							{{ t('checkout.cash_descr') }}
						</p>
					</div>
				</transition>
			</ion-radio-group>
		</div>
	</div>
</template>

<script>
import Input from '@/components/common/Input.vue';
import { ref } from '@vue/reactivity';
import {
	IonItem,
	IonLabel,
	IonRadio,
	IonRadioGroup,
	IonIcon,
	IonCheckbox,
} from '@ionic/vue';
import { cardOutline, cashOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n/index';

const PAYMENT_TYPES = ['card', 'cash'];

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
	props: {
		paymentUrl: {
			type: String,
			default: null,
		},
		cards: {
			type: Array,
			default: null,
		},
	},
	setup(_, { emit }) {
		const paymentType = ref(null);
		const saveCardDetails = ref(null);
		const selectedCard = ref(null);
		const { t } = useI18n();

		const handlePaymentTypeChange = (e) => {
			if (!PAYMENT_TYPES.includes(e.target.value)) {
				e.preventDefault();
				return;
			}

			paymentType.value = e.target.value;

			if (paymentType.value === 'cash') {
				selectedCard.value = null;
			}

			emit('payment-type', paymentType.value);
		};

		const itemClick = (v) => {
			if (selectedCard.value === v.rectoken) {
				selectedCard.value = null;
			} else {
				selectedCard.value = v.rectoken;
			}

			emit('payment-card', selectedCard.value);
		};

		return {
			cardOutline,
			cashOutline,
			paymentType,
			handlePaymentTypeChange,
			saveCardDetails,
			selectedCard,
			itemClick,
			t,
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

.logo {
	width: 50px;
	height: auto;
	text-align: center;

	img {
		max-width: 100%;
		max-height: 16px;
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

.card-item {
	padding-left: 0 !important;
	// background: var(--white);
	transition: all 0.3s ease-in-out;

	& > div {
		border: 1px solid var(--ion-color-light);
		border-radius: 10px;
		padding: 10px;
		background: var(--white);
		margin-bottom: 5px;
		transition: all 0.2s;
	}

	&.active {
		& > div {
			background-color: var(--grey-medium);
		}
	}

	&:active {
		& > div {
			background-color: var(--grey-medium);
		}
	}
}
</style>
