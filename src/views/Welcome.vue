<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="page-content overflow-hidden is-flex is-flex-direction-column ion-align-items-center ion-justify-content-center"
			>
				<div class="relative w-100">
					<div
						class="ion-padding-horizontal is-flex is-flex-direction-column ion-justify-content-between"
					>
						<h2 class="ion-text-center color-white mb-5 fw-400">
							<span class="fz-50">
								👋🏻
							</span>
							<br />

							<span class="fz-16 fw-400">
								Welcome to
							</span>
							<br />
							<span class="fz-40 fw-500 niamka">
								Niamka
							</span>
						</h2>
					</div>
				</div>

				<div
					class="bg-white w-100 ion-padding-start ion-padding-end mt-auto btn-container"
				>
					<Button
						color="primary"
						expand="block"
						@click="$router.replace('/phone-register')"
					>
						Let's begin
					</Button>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<script>
import { IonContent, IonPage, loadingController, IonFab } from '@ionic/vue';
import Button from '@/components/common/Button.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
	name: 'Welcome',
	components: {
		IonContent,
		IonPage,
		Button,
		IonFab,
	},
	setup() {
		return {};
	},
};
</script>

<style scoped lang="scss">
$gradientTopColor: #f17e48;
$gradientBottomColor: #ec5230;

.page-content {
	max-height: 100vh;
	min-height: 100vh;
	padding-top: 200px;
	background: linear-gradient(
		180deg,
		$gradientTopColor 0.39%,
		$gradientBottomColor 70.34%
	);
}

.btn-container {
	padding-top: 20px;
	padding-bottom: 50px;
	border-top-left-radius: 50px;
	border-top-right-radius: 50px;
}
</style>
