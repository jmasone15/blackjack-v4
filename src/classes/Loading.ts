import domElements from '../utils/domElements';
import delay from '../utils/delay';

const { showElement, hideElement } = domElements;

class Loading {
	isLoading: boolean;
	spinner: HTMLDivElement;
	spinnerMsg: HTMLParagraphElement;

	constructor() {
		this.isLoading = false;
		this.spinner = document.getElementById('loading-spinner') as HTMLDivElement;
		this.spinnerMsg = document.getElementById(
			'loading-message'
		) as HTMLParagraphElement;

		console.log('Loading Class ready.');
	}

	async setLoading(
		flag: boolean,
		msg?: string,
		delayMS?: number
	): Promise<void> {
		this.isLoading = flag;

		if (flag) {
			// Update DOM
			this.spinnerMsg.textContent = msg || 'Loading...';
			showElement(this.spinner, 'spinner-overlay');

			// Loading Delay
			if (delayMS !== 0) {
				await delay(delayMS || 250);
			}
		} else {
			// Update DOM
			this.spinnerMsg.textContent = null;
			hideElement(this.spinner);
		}

		return;
	}
}

const loading = new Loading();
export default loading;
