<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div class="page-content overflow-hidden">
				<div ref="topText">
					<TopIcons> Hello!</TopIcons>
				</div>

				<div class="bottom-screen relative" ref="bottomScreen">
					<BorderedBackground class="absolute background" />

					<form
						class="form ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
						@submit.prevent="handleSubmit"
					>
						<div>
							<!-- <Input
								label="Email"
								placeholder="Email"
								v-model="email"
								required
							/> -->
							<Input
								label="Password"
								placeholder="Password"
								type="password"
								required
								v-model="password"
								class="mt-2"
							/>
							<Input
								label="Repeat password"
								placeholder="Repeat password"
								type="password"
								required
								v-model="repeatPassword"
								class="mt-2"
							/>
						</div>

						<div class="btn-container">
							<Button
								color="light"
								expand="full"
								shape="round"
								type="submit"
								class="custom-btn-light"
								@click="$router.replace('/')"
							>
								Submit
							</Button>
						</div>
					</form>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage } from '@ionic/vue';
import BorderedBackground from '@/components/common/BorderedBackground.vue';
import useVerticalAnimation from '@/composables/useVerticalAnimation.js';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import TopIcons from '@/components/signUp/TopIcons.vue';
import { ref } from 'vue';

export default {
	name: 'SignUp',
	components: {
		BorderedBackground,
		IonContent,
		IonPage,
		Input,
		Button,
		TopIcons,
	},
	setup() {
		const { bottomScreen, topText } = useVerticalAnimation();
		const email = ref('');
		const password = ref('');
		const repeatPassword = ref('');

		const handleSubmit = () => {
			console.log('Submit');
		};

		return {
			bottomScreen,
			topText,
			email,
			password,
			repeatPassword,
			handleSubmit,
		};
	},
};
</script>

<style scoped lang="scss">
.page-content {
	max-height: 100vh;
	min-height: 100vh;
}

.background {
	left: 0;
	top: 0;
	width: 100%;
	min-height: 100%;
}

.bottom-screen {
	min-height: 70vh;
	height: 70vh;
	max-height: 70vh;

	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: var(--ion-color-primary);
		top: 200px;
		display: block;
	}
}

.form {
	padding-top: 50px;
	height: calc(100% - 20px);
}
</style>
