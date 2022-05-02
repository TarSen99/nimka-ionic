import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function () {
	const hapticsImpactMedium = async () => {
		await Haptics.impact({ style: ImpactStyle.Medium });
	};

	const hapticsImpactHeavy = async () => {
		await Haptics.impact({ style: ImpactStyle.Heavy });
	};

	return {
		hapticsImpactMedium,
		hapticsImpactHeavy,
	};
}
