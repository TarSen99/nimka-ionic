<template>
	<div>
		<table class="w-100">
			<tr>
				<td>
					Product name:
				</td>

				<td>
					<span class="fw-500 color-primary">Best burger</span>
				</td>
			</tr>

			<tr>
				<td>
					Order created at:
				</td>

				<td>
					<span class="fw-500 color-primary">26.10.20 18:50</span>
				</td>
			</tr>

			<tr>
				<td>
					Quanity:
				</td>

				<td>
					<span class="fw-500 color-primary">2</span>
				</td>
			</tr>

			<tr>
				<td>
					Price per one:
				</td>

				<td>
					<span class="fw-500 color-primary">50 UAN</span>
				</td>
			</tr>

			<tr>
				<td>
					Total price:
				</td>

				<td>
					<span class="fw-500 color-primary">100 UAN</span>
				</td>
			</tr>

			<tr>
				<td>
					Comission:
				</td>

				<td>
					<span class="fw-500 color-primary">15 UAN</span>
				</td>
			</tr>

			<tr>
				<td>
					Total income:
				</td>

				<td>
					<span class="fw-500 color-primary">85 UAN</span>
				</td>
			</tr>

			<tr>
				<td>
					Payment method:
				</td>

				<td>
					<span class="fw-500 color-primary">Credit card</span>
				</td>
			</tr>

			<tr>
				<td>
					Status:
				</td>

				<td>
					<span class="fw-500 color-success">PAYED</span>
				</td>
			</tr>

			<tr class="tr-border">
				<td>
					Customer name:
				</td>

				<td>
					<span class="fw-500 color-primary">Taras Seniv</span>
				</td>
			</tr>

			<tr>
				<td>
					Customer mobile:
				</td>

				<td>
					<span class="fw-500 color-primary">+380 96 904 53 49</span>
				</td>
			</tr>
		</table>

		<div class="is-flex is-flex-direction-column mt-5 pt-5">
			<p class="ion-text-center fw-500 color-dark">
				Please ask customer to show QR code and scan it by clicking on "Complete
				order" button. <br />

				Customer needs to pickup order till
				<Badge color="dark" class="px-3 mt-2">
					<span class="fz-14"> 20:00 </span>
				</Badge>
				or it will be automatically cancelled.
			</p>
			<Button color="success" class="w-100">
				Complete order
			</Button>

			<Button color="secondary" class="w-100">
				Call customer
			</Button>

			<Button color="danger" class="w-100">
				Cancel order
			</Button>
		</div>
	</div>
</template>

<script>
import Button from '@/components/common/Button.vue';
import Badge from '@/components/common/Badge.vue';

export default {
	name: 'OrderDetails',
	components: {
		Button,
		Badge,
	},
};
</script>

<style lang="scss" scoped>
td {
	padding: 5px 10px;

	&:first-child {
		padding-left: 0;
	}
}

.tr-border {
	border-top: 1px solid var(--ion-text-color);
}
</style>
