<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
			>
				<div class="bottom-screen relative" ref="bottomScreen">
					<form
						class="form ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
						@submit.prevent="handleSubmit"
					>
						<h2 class="ion-text-center color-white mb-5 fw-400 fz-16">
							<span class="fz-50"> 📩 </span>
							<br />
							<br />

							Please enter code from SMS here
						</h2>

						<div class="is-flex">
							<Input
								v-for="(item, index) in values"
								:key="index"
								class="px-1 code-input"
								:modelValue="item.value"
								:ref="
									(el) => {
										if (el) valuesRefs[index] = el;
									}
								"
								:disabled="pinIsDisabled"
								:maxlength="1"
								:max="9"
								type="number"
								@keydown="handleCodeInput(item, index)"
								@update:modelValue="handleValueUpdate($event, index)"
								@focus="handleInputFocus(index)"
								@paste="handlePaste"
							/>
						</div>

						<span id="sign-in-button"></span>
					</form>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage } from '@ionic/vue';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import verifyPin from '@/composables/auth/verifyPin.js';

export default {
	name: 'PhoneRegisterPin',
	components: {
		IonContent,
		IonPage,
		Input,
		Button,
	},
	setup() {
		const {
			handleCodeInput,
			code,
			values,
			valuesRefs,
			handleInputFocus,
			handlePaste,
			verify,
			pinIsDisabled,
		} = verifyPin();

		const submit = async () => {
			verify();
		};

		const handleValueUpdate = (v, index) => {
			const newV = (v || '') + '';

			if (newV.length === 6) {
				handlePaste(v, true);
				submit();
				return;
			}

			const oneDigit = newV.slice(newV.length - 1, newV.length);

			const test = /\d/.test(oneDigit);
			if (!test) {
				values[index].value = '0';
			} else {
				values[index].value = oneDigit;
			}

			if (code.value.length === values.length) {
				submit();
			}
		};

		return {
			values,
			valuesRefs,
			handleCodeInput,
			handleValueUpdate,
			handleInputFocus,
			handlePaste,
			pinIsDisabled,
		};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.page-content {
	max-height: 100vh;
	min-height: 100vh;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);
}

::v-deep(.code-input) {
	.input-el {
		--padding-start: 0 !important;
		--padding-end: 0 !important;
		border-radius: 5px !important;

		input {
			padding: 2px;
			text-align: center;
			font-size: 20px;
			font-weight: 600;
		}
	}
}

#sign-in-button {
	opacity: 0;
	position: absolute;
	left: -200px;
	top: -200px;
}
</style>
