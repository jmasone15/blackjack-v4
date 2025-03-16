import domElements from '../utils/domElements';

const { showElement } = domElements;

export default class Card {
	suit: string;
	value: number;
	isFaceDown: boolean;
	isDoubleCard: boolean;
	domElement?: HTMLDivElement;

	constructor(suit: string, value: number, isFaceDown?: boolean) {
		this.suit = suit;
		this.value = value;
		this.isFaceDown = isFaceDown || false;
		this.isDoubleCard = false;
	}

	generateCardFace() {
		if (!this.domElement) {
			return;
		}

		let colorClass = ['♣', '♠'].includes(this.suit) ? 'black' : 'red';
		let valueText: string;

		if (this.value > 10) {
			switch (this.value) {
				case 11:
					valueText = 'J';
					break;
				case 12:
					valueText = 'Q';
					break;
				case 13:
					valueText = 'K';
					break;

				default:
					valueText = 'A';
					break;
			}
		} else {
			valueText = this.value.toString();
		}

		showElement(this.domElement, `card card-${colorClass}`);
		this.domElement.innerText = `${valueText}${this.suit}`;
	}

	flipOver() {
		if (!this.isFaceDown && !this.isDoubleCard) {
			return;
		} else {
			this.isDoubleCard = false;
			this.isFaceDown = false;
			return this.generateCardFace();
		}
	}

	createCardElement(parentHandDiv: HTMLDivElement) {
		// Create DOM Element
		this.domElement = document.createElement('div');

		// Set DOM Element Properties
		if (this.isDoubleCard) {
			showElement(this.domElement, 'card card-black card-double');
			this.domElement.innerText = `?`;
		} else if (this.isFaceDown) {
			showElement(this.domElement, 'card card-black face-down');
			this.domElement.innerText = `?`;
		} else {
			this.generateCardFace();
		}

		// Append to UI
		parentHandDiv.appendChild(this.domElement);

		return;
	}
}
