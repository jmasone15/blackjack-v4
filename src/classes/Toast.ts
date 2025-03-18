import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import '../style.css';

class Toast {
	toast: typeof Toastify;
	defaultOptions: any;

	constructor() {
		this.toast = Toastify;
		this.defaultOptions = {
			close: false,
			duration: 2000,
			position: 'right',
			stopOnFocus: false,
			offset: {
				x: 0,
				y: 60
			}
		};
	}

	positiveToast(msg: string) {
		let updatedOptions = {
			...this.defaultOptions,
			text: msg,
			className: 'toast-positive'
		};

		return this.toast(updatedOptions).showToast();
	}

	neutralToast(msg: string) {
		let updatedOptions = {
			...this.defaultOptions,
			text: msg,
			className: 'toast-neutral'
		};

		return this.toast(updatedOptions).showToast();
	}

	negativeToast(msg: string) {
		let updatedOptions = {
			...this.defaultOptions,
			text: msg,
			className: 'toast-negative'
		};

		return this.toast(updatedOptions).showToast();
	}
}

const toast = new Toast();
export default toast;
