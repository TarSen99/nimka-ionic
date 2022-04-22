class PaymentService {
	constructor() {
		this.fondy = null;
		this.scriptLoaded = false;
		this.styleLoaded = false;
		this.loaded = false;
		this.onInitList = [];
	}

	init() {
		return new Promise((resolve) => {
			if (window.fondy) {
				this.loaded = true;
				return resolve();
			}

			const css = document.createElement('link');
			css.rel = 'stylesheet';
			css.href = 'https://pay.fondy.eu/latest/checkout-vue/checkout.css';

			const script = document.createElement('script');
			script.src = `https://pay.fondy.eu/latest/checkout-vue/checkout.js`;
			document.getElementsByTagName('head')[0].appendChild(script);
			document.getElementsByTagName('head')[0].appendChild(css);

			script.onload = () => {
				this.fondy = window.fondy;
				this.scriptLoaded = true;
				this.checkLoad(resolve);
			};

			css.onload = () => {
				this.styleLoaded = true;
				this.checkLoad(resolve);
			};
		});
	}

	checkLoad(resolve) {
		if (this.scriptLoaded && this.styleLoaded) {
			this.loaded = true;
			this.onInitList.forEach((el) => {
				el();
			});

			this.onInitList = [];

			resolve();
		}
	}

	onInit(callback) {
		if (this.loaded) {
			callback();
			return;
		}

		this.onInitList.push(callback);
	}
}

const paymentService = new PaymentService();

export default paymentService;
