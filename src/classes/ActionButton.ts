import domElements from '../utils/domElements';

const { showElement, hideElement } = domElements;

export default class ActionButton {
	domElement: HTMLButtonElement;
	permanentDisable: boolean;

	// Action Buttons start disabled in HTML by default.
	constructor(id: string, actionFunc: Function) {
		this.domElement = document.getElementById(id) as HTMLButtonElement;

		this.domElement.addEventListener('click', (e: Event) => {
			e.preventDefault();

			if (this.domElement.getAttribute('class') !== 'disabled') {
				return actionFunc();
			} else {
				return console.log('Button Disabled');
			}
		});

		this.permanentDisable = false;
	}

	enableButton() {
		showElement(this.domElement, 'button');
		return;
	}

	disableButton() {
		showElement(this.domElement, 'disabled');
		return;
	}

	hideButton() {
		hideElement(this.domElement);
		return;
	}
}
