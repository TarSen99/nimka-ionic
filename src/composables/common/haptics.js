import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function () {
	const hapticsImpactLight = async () => {
		await Haptics.impact({ style: ImpactStyle.Light });
	};

	const hapticsImpactMedium = async () => {
		await Haptics.impact({ style: ImpactStyle.Medium });
	};

	const hapticsImpactHeavy = async () => {
		await Haptics.impact({ style: ImpactStyle.Heavy });
	};

	return {
		hapticsImpactMedium,
		hapticsImpactHeavy,
		hapticsImpactLight,
	};
}
