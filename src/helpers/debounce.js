export default function(f, delay) {
	let timerId;

	return function(...props) {
		clearTimeout(timerId);

		timerId = setTimeout(() => {
			f(...props);
		}, delay);
	};
}
