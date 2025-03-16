import Card from './Card';
import domElements from '../utils/domElements';

const { showElement, dealerDiv, playerHandsDiv } = domElements;

export default class Hand {
	id: number;
	total: number;
	private cards: Card[];
	private aceCount: number;
	private isDealer: boolean;
	private isActive: boolean;
	hideTotal: boolean;
	domElement: HTMLDivElement;
	totalElement: HTMLParagraphElement;
	cardsContainerElement: HTMLDivElement;

	constructor(id: number) {
		this.id = id;
		this.cards = [];
		this.total = 0;
		this.aceCount = 0;
		this.isActive = false;
		this.isDealer = this.id == -1;
		this.hideTotal = this.isDealer;
		this.domElement = document.createElement('div');
		this.totalElement = document.createElement('p') as HTMLParagraphElement;
		this.cardsContainerElement = document.createElement('div');

		// Set DOM Elements Properties and Children
		let elementId = this.isDealer ? 'dealer-hand' : `hand-${this.id}`;
		this.domElement.setAttribute('id', elementId);

		this.totalElement.innerText = `??`;
		this.domElement.appendChild(this.cardsContainerElement);
		this.domElement.appendChild(this.totalElement);

		showElement(this.domElement, 'hand');
		showElement(this.totalElement, 'total');
		showElement(this.cardsContainerElement, 'cards-container');

		// Add Hand to UI
		if (this.isDealer) {
			dealerDiv.appendChild(this.domElement);
		} else {
			playerHandsDiv.appendChild(this.domElement);
		}
	}

	get isTurnOver() {
		return this.total > 20;
	}

	// Dealer will hit until 17 or more.
	get shouldDealerHit() {
		return this.total < 17;
	}

	// Highlight the total in the case of split hands
	set active(bool: boolean) {
		this.isActive = bool;

		if (this.isActive) {
			showElement(this.totalElement, 'total total-highlight');
		} else {
			showElement(this.totalElement, 'total');
		}
	}

	deal(card: Card) {
		this.cards.push(card);
		card.createCardElement(this.domElement);

		if (card.domElement !== undefined) {
			this.cardsContainerElement.appendChild(card.domElement);
		}

		this.calculateTotal();
	}

	calculateTotal(showMaxTotal: boolean = false) {
		// Set Variables
		this.total = 0;
		let totalString: string;

		// Initial Total
		for (const { value } of this.cards) {
			if (value == 14) {
				// Ace
				this.total++;
				this.aceCount++;
			} else if (value > 10) {
				// J, Q, K
				this.total += 10;
			} else {
				// Numeric Cards
				this.total += value;
			}
		}

		// Handle Ace Scenarios
		if (this.aceCount > 0 && this.total + 10 < 22) {
			if (this.total + 10 == 21) {
				totalString = '21';
				this.total = 21;
			} else {
				if (showMaxTotal) {
					totalString = `${this.total + 10}`;
				} else {
					totalString = `${this.total} / ${this.total + 10}`;
				}

				this.total += 10;
			}
		} else {
			totalString = this.total.toString();
		}

		// Handle FaceDown Cards in Hand
		if (this.hideTotal) {
			totalString = '??';
		}

		// Update DOM
		this.totalElement.innerText = totalString;
	}

	showHandAndTotal(showMaxTotal: boolean = false) {
		this.cards.forEach((card: Card) => {
			if (card.isFaceDown) {
				card.flipOver();
			}
		});

		this.hideTotal = false;

		return this.calculateTotal(showMaxTotal);
	}
}
