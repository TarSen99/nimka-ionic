class GoogleService {
	constructor() {
		this.autocomplete = null;
		this.geocoder = null;
		this.script = null;
		this.loaded = false;
		this.onInitList = [];
	}

	init() {
		return new Promise((resolve) => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_API_KEY}&libraries=places`;
			document.getElementsByTagName('head')[0].appendChild(script);

			script.onload = () => {
				this.autocomplete = new window.google.maps.places.AutocompleteService();
				this.geocoder = new window.google.maps.Geocoder();
				resolve();
				this.loaded = true;

				this.onInitList.forEach((el) => {
					el();
				});

				this.onInitList = [];
			};

			this.script = script;
		});
	}

	onInit(callback) {
		if (this.loaded) {
			callback();
			return;
		}

		this.onInitList.push(callback);
	}
}

const googleService = new GoogleService();

export default googleService;
