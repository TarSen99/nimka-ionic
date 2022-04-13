export default function () {
	const padding = 30;
	const screenWidth = screen.width;

	const screenWidthPadding = screenWidth - padding;

	return {
		screenWidth,
		screenWidthPadding,
	};
}
